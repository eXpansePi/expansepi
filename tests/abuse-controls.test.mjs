import assert from "node:assert/strict"
import { test } from "node:test"
import { FixedWindowRateLimiter, consumeWithCeiling } from "../lib/rate-limit.ts"
import { getTrustedClientIp, isBehindTrustedProxy, isIpAddress } from "../lib/request-identity.ts"

const VERCEL = { VERCEL: "1" }

function headersOf(entries) {
  return new Headers(entries)
}

test("a client is allowed up to the limit and rejected afterwards", () => {
  const limiter = new FixedWindowRateLimiter({ limit: 3, windowMs: 60_000 })
  const now = 1_000_000

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    assert.equal(limiter.consume("client", now).allowed, true, `attempt ${attempt}`)
  }
  const rejected = limiter.consume("client", now)
  assert.equal(rejected.allowed, false)
  assert.equal(rejected.retryAfterSeconds, 60)
})

test("repeated requests stay rejected for the remainder of the window", () => {
  const limiter = new FixedWindowRateLimiter({ limit: 1, windowMs: 60_000 })
  const now = 1_000_000

  assert.equal(limiter.consume("client", now).allowed, true)
  for (const offset of [1, 100, 30_000, 59_999]) {
    assert.equal(limiter.consume("client", now + offset).allowed, false, `offset ${offset}`)
  }
})

test("a new window restores the budget", () => {
  const limiter = new FixedWindowRateLimiter({ limit: 2, windowMs: 60_000 })
  const now = 1_000_000

  limiter.consume("client", now)
  limiter.consume("client", now)
  assert.equal(limiter.consume("client", now).allowed, false)
  assert.equal(limiter.consume("client", now + 60_000).allowed, true)
})

test("retry-after shrinks as the window elapses and never reports zero", () => {
  const limiter = new FixedWindowRateLimiter({ limit: 1, windowMs: 60_000 })
  const now = 1_000_000

  limiter.consume("client", now)
  assert.equal(limiter.consume("client", now + 15_000).retryAfterSeconds, 45)
  assert.equal(limiter.consume("client", now + 59_999).retryAfterSeconds, 1)
})

test("expired entries are swept rather than accumulating", () => {
  const limiter = new FixedWindowRateLimiter({ limit: 5, windowMs: 1_000 })

  for (let index = 0; index < 500; index += 1) {
    limiter.consume(`client-${index}`, 1_000_000 + index)
  }
  assert.equal(limiter.size, 500)

  limiter.consume("late", 1_000_000 + 500 + 1_000)
  assert.equal(limiter.size, 1, "only the live window should remain")
})

test("tracked keys stay bounded when every entry is still live", () => {
  const limiter = new FixedWindowRateLimiter({ limit: 5, windowMs: 60_000, maxEntries: 50 })

  for (let index = 0; index < 500; index += 1) {
    limiter.consume(`client-${index}`, 1_000_000 + index)
  }
  assert.ok(limiter.size <= 50, `expected at most 50 entries, saw ${limiter.size}`)
})

test("clients are limited independently", () => {
  const limiter = new FixedWindowRateLimiter({ limit: 1, windowMs: 60_000 })
  const now = 1_000_000

  assert.equal(limiter.consume("a", now).allowed, true)
  assert.equal(limiter.consume("a", now).allowed, false)
  assert.equal(limiter.consume("b", now).allowed, true, "one client must not consume another's budget")
})

test("forwarding headers are ignored without a trusted proxy", () => {
  assert.equal(isBehindTrustedProxy({}), false)
  assert.equal(getTrustedClientIp(headersOf({ "x-forwarded-for": "203.0.113.9" }), {}), null)
  assert.equal(getTrustedClientIp(headersOf({ "x-real-ip": "203.0.113.9" }), {}), null)
})

test("a trusted proxy supplies the client address", () => {
  assert.equal(getTrustedClientIp(headersOf({ "x-forwarded-for": "203.0.113.9" }), VERCEL), "203.0.113.9")
  assert.equal(getTrustedClientIp(headersOf({ "x-real-ip": "2001:db8::1" }), VERCEL), "2001:db8::1")
})

test("the platform header wins over the client-facing ones", () => {
  const headers = headersOf({
    "x-vercel-forwarded-for": "198.51.100.7",
    "x-real-ip": "203.0.113.9",
    "x-forwarded-for": "192.0.2.1",
  })
  assert.equal(getTrustedClientIp(headers, VERCEL), "198.51.100.7")
})

test("only the proxy-written entry of a forwarded chain is used", () => {
  const headers = headersOf({ "x-forwarded-for": "198.51.100.7, 203.0.113.9, 192.0.2.1" })
  assert.equal(getTrustedClientIp(headers, VERCEL), "198.51.100.7")
})

test("missing and malformed headers yield no identity", () => {
  assert.equal(getTrustedClientIp(headersOf({}), VERCEL), null)
  for (const value of ["", "   ", "not-an-ip", "999.999.999.999", "1.2.3", "<script>", "203.0.113.9; DROP", "::gg"]) {
    assert.equal(getTrustedClientIp(headersOf({ "x-forwarded-for": value }), VERCEL), null, `value ${JSON.stringify(value)}`)
  }
})

test("a malformed preferred header falls through to a valid one", () => {
  const headers = headersOf({ "x-real-ip": "garbage", "x-forwarded-for": "203.0.113.9" })
  assert.equal(getTrustedClientIp(headers, VERCEL), "203.0.113.9")
})

test("address validation accepts real addresses and rejects near misses", () => {
  for (const value of ["0.0.0.0", "255.255.255.255", "10.0.0.1", "::1", "::", "2001:db8::1", "fe80::1"]) {
    assert.equal(isIpAddress(value), true, `expected ${value} to be valid`)
  }
  for (const value of ["256.0.0.1", "1.2.3.4.5", "01.2.3.4.", "", "localhost", "2001:db8:::1"]) {
    assert.equal(isIpAddress(value), false, `expected ${value} to be invalid`)
  }
})

test("spoofed identities cannot multiply the budget when untrusted", () => {
  const limiter = new FixedWindowRateLimiter({ limit: 2, windowMs: 60_000 })
  const now = 1_000_000
  const spoofed = ["1.2.3.4", "5.6.7.8", "9.10.11.12", "13.14.15.16"]

  const outcomes = spoofed.map(value => {
    const ip = getTrustedClientIp(headersOf({ "x-forwarded-for": value }), {})
    return limiter.consume(ip ?? "unidentified", now).allowed
  })

  assert.deepEqual(outcomes, [true, true, false, false], "all spoofed values must share one bucket")
})

test("a blocked caller cannot drain the shared ceiling", () => {
  const perCaller = new FixedWindowRateLimiter({ limit: 2, windowMs: 60_000 })
  const ceiling = new FixedWindowRateLimiter({ limit: 5, windowMs: 60_000, maxEntries: 1 })
  const now = 1_000_000

  // One caller floods well past its own budget.
  for (let attempt = 0; attempt < 50; attempt += 1) {
    consumeWithCeiling(perCaller, ceiling, "flooder", "instance", now)
  }

  // Other callers must still be served from the untouched ceiling.
  for (const caller of ["second", "third", "fourth"]) {
    assert.equal(consumeWithCeiling(perCaller, ceiling, caller, "instance", now).allowed, true, caller)
  }
})

test("the shared ceiling still bounds distinct callers", () => {
  const perCaller = new FixedWindowRateLimiter({ limit: 5, windowMs: 60_000 })
  const ceiling = new FixedWindowRateLimiter({ limit: 3, windowMs: 60_000, maxEntries: 1 })
  const now = 1_000_000

  const outcomes = ["a", "b", "c", "d", "e"].map(
    caller => consumeWithCeiling(perCaller, ceiling, caller, "instance", now).allowed,
  )

  assert.deepEqual(outcomes, [true, true, true, false, false])
})

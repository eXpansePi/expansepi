/**
 * Fixed-window rate limiting primitives.
 *
 * State lives in the instance that serves the request, so on serverless
 * platforms this bounds abuse per instance rather than globally. A distributed
 * store or edge/WAF rule is required for a hard guarantee; see DEVELOPMENT.md.
 *
 * @module lib/rate-limit
 */

export interface RateLimitDecision {
  readonly allowed: boolean
  /** Seconds until the caller may retry. Zero when the request was allowed. */
  readonly retryAfterSeconds: number
}

export interface RateLimiterOptions {
  /** Requests permitted per key per window. */
  readonly limit: number
  readonly windowMs: number
  /** Upper bound on tracked keys, so the map cannot grow without limit. */
  readonly maxEntries?: number
}

interface Window {
  count: number
  resetAt: number
}

const ALLOWED: RateLimitDecision = { allowed: true, retryAfterSeconds: 0 }

export class FixedWindowRateLimiter {
  private readonly windows = new Map<string, Window>()
  private readonly limit: number
  private readonly windowMs: number
  private readonly maxEntries: number
  private lastSweptAt = 0

  constructor({ limit, windowMs, maxEntries = 10_000 }: RateLimiterOptions) {
    if (!Number.isInteger(limit) || limit < 1) throw new RangeError("limit must be a positive integer")
    if (!Number.isInteger(windowMs) || windowMs < 1) throw new RangeError("windowMs must be a positive integer")
    if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new RangeError("maxEntries must be a positive integer")
    this.limit = limit
    this.windowMs = windowMs
    this.maxEntries = maxEntries
  }

  consume(key: string, now: number = Date.now()): RateLimitDecision {
    this.sweepExpired(now)

    const window = this.windows.get(key)
    if (!window || now >= window.resetAt) {
      this.windows.set(key, { count: 1, resetAt: now + this.windowMs })
      this.enforceCapacity()
      return ALLOWED
    }

    window.count += 1
    if (window.count <= this.limit) return ALLOWED

    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((window.resetAt - now) / 1000)) }
  }

  /** Number of tracked keys. Exposed so expiry and eviction can be asserted. */
  get size(): number {
    return this.windows.size
  }

  clear(): void {
    this.windows.clear()
    this.lastSweptAt = 0
  }

  /**
   * Runs at most once per window so the common path stays O(1) while expired
   * entries still cannot accumulate across windows.
   */
  private sweepExpired(now: number): void {
    if (now - this.lastSweptAt < this.windowMs) return
    this.lastSweptAt = now
    for (const [key, window] of this.windows) {
      if (now >= window.resetAt) this.windows.delete(key)
    }
  }

  /**
   * Hard bound for the case where every tracked window is still live. Evicts
   * the entries closest to expiring: they are the cheapest for a caller to
   * re-earn and the least useful to keep.
   */
  private enforceCapacity(): void {
    if (this.windows.size <= this.maxEntries) return
    const excess = this.windows.size - this.maxEntries
    const byExpiry = Array.from(this.windows).sort((a, b) => a[1].resetAt - b[1].resetAt)
    for (let index = 0; index < excess; index += 1) {
      this.windows.delete(byExpiry[index][0])
    }
  }
}

/**
 * Charges a per-caller budget before a shared ceiling.
 *
 * The order matters: a caller that has already exhausted its own budget must
 * not consume the shared one, otherwise a single blocked caller could exhaust
 * the ceiling and deny the endpoint to everyone else.
 */
export function consumeWithCeiling(
  perCaller: FixedWindowRateLimiter,
  ceiling: FixedWindowRateLimiter,
  callerKey: string,
  ceilingKey: string,
  now?: number,
): RateLimitDecision {
  const caller = perCaller.consume(callerKey, now)
  if (!caller.allowed) return caller
  return ceiling.consume(ceilingKey, now)
}

import assert from "node:assert/strict"
import { test } from "node:test"
import { serializeJsonLd } from "../lib/seo.ts"
import { normalizeEmailForHashing, normalizePhoneForHashing } from "../lib/enhanced-conversions.ts"

test("structured data cannot close its own script element", () => {
  const payload = serializeJsonLd({ name: "</script><img src=x onerror=alert(1)>" })
  assert.ok(!payload.includes("</script>"), "raw closing tag must not survive")
  assert.ok(!payload.includes("<"), "no raw angle bracket may remain")
  assert.equal(JSON.parse(payload).name, "</script><img src=x onerror=alert(1)>", "value must round-trip")
})

test("structured data escapes comment and CDATA sequences", () => {
  const payload = serializeJsonLd({ name: "<!--", description: "]]>" })
  assert.ok(!payload.includes("<!--"))
  assert.ok(!payload.includes("]]>"))
  const parsed = JSON.parse(payload)
  assert.equal(parsed.name, "<!--")
  assert.equal(parsed.description, "]]>")
})

test("structured data escapes line separators that break script parsing", () => {
  const payload = serializeJsonLd({ name: "a\u2028b\u2029c" })
  assert.ok(!payload.includes("\u2028"))
  assert.ok(!payload.includes("\u2029"))
  assert.equal(JSON.parse(payload).name, "a\u2028b\u2029c")
})

test("structured data preserves quotes and non-latin content", () => {
  const value = { name: `"Kurz" & 'cena' — Привет`, nested: { list: ["<b>", "ř"] } }
  assert.deepEqual(JSON.parse(serializeJsonLd(value)), value)
})

test("email normalisation lower-cases and trims", () => {
  assert.equal(normalizeEmailForHashing("  Jan.Novak@Seznam.CZ "), "jan.novak@seznam.cz")
})

test("gmail dots and tags are removed, other providers keep theirs", () => {
  assert.equal(normalizeEmailForHashing("Jan.Novak+kurzy@gmail.com"), "jannovak@gmail.com")
  assert.equal(normalizeEmailForHashing("jan.novak@googlemail.com"), "jannovak@googlemail.com")
  assert.equal(normalizeEmailForHashing("jan.novak+kurzy@seznam.cz"), "jan.novak+kurzy@seznam.cz")
})

test("phone numbers are converted to E.164", () => {
  assert.equal(normalizePhoneForHashing("+420 775 715 700"), "+420775715700")
  assert.equal(normalizePhoneForHashing("775 715 700"), "+420775715700")
  assert.equal(normalizePhoneForHashing("(775) 715-700"), "+420775715700")
  assert.equal(normalizePhoneForHashing("00420775715700"), "+420775715700")
})

test("phone numbers of unknown shape are dropped rather than guessed", () => {
  for (const value of ["", "12345", "abc", "+0123456789", "1234567", "12345678901234567890"]) {
    assert.equal(normalizePhoneForHashing(value), null, `value ${JSON.stringify(value)}`)
  }
})

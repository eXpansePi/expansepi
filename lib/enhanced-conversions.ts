/**
 * Value normalisation for Google Ads enhanced conversions.
 *
 * Google matches on normalised values, so a mis-normalised value is silently
 * dropped on their side rather than reported as an error. Kept free of imports
 * so the rules can be unit tested in isolation.
 *
 * @module lib/enhanced-conversions
 */

/** Lower-cases and trims, and removes Gmail's ignored dots and `+tags`. */
export function normalizeEmailForHashing(email: string): string {
  const trimmed = email.trim().toLowerCase()
  const separator = trimmed.lastIndexOf("@")
  if (separator < 1) return trimmed

  const local = trimmed.slice(0, separator)
  const domain = trimmed.slice(separator + 1)
  if (domain !== "gmail.com" && domain !== "googlemail.com") return trimmed

  return `${local.split("+")[0].replace(/\./g, "")}@${domain}`
}

/**
 * Converts to E.164. A bare national number is assumed Czech because that is
 * the audience the form serves; anything else is omitted rather than sent
 * under a guessed country code.
 */
export function normalizePhoneForHashing(phone: string): string | null {
  let digits = phone.replace(/[^\d+]/g, "")
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`

  if (digits.startsWith("+")) return /^\+[1-9]\d{7,14}$/.test(digits) ? digits : null
  return /^\d{9}$/.test(digits) ? `+420${digits}` : null
}

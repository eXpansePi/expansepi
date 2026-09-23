/**
 * Shared form utilities
 * @module lib/form-utils
 */

import { hasTrackingConsent } from "./consent"
import { normalizeEmailForHashing, normalizePhoneForHashing } from "./enhanced-conversions"

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")
}

export async function trackApplicationConversion(email: string, phone: string, honeypot: string): Promise<void> {
  if (honeypot || typeof window === "undefined" || !hasTrackingConsent() || typeof window.gtag !== "function") return
  const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL
  if (!conversionId || !conversionLabel) return

  const userData: Record<string, string> = {}
  try {
    const normalizedEmail = normalizeEmailForHashing(email)
    if (normalizedEmail) userData.sha256_email_address = await sha256Hex(normalizedEmail)
    const normalizedPhone = normalizePhoneForHashing(phone)
    if (normalizedPhone) userData.sha256_phone_number = await sha256Hex(normalizedPhone)
  } catch {
    // Web Crypto is unavailable outside a secure context: report the
    // conversion without identifiers rather than losing it entirely.
    for (const key of Object.keys(userData)) delete userData[key]
  }

  // Consent can be withdrawn while the hashing above is awaited.
  if (!hasTrackingConsent()) return
  window.gtag("event", "conversion", { send_to: `${conversionId}/${conversionLabel}`, value: 1, currency: "CZK", ...(Object.keys(userData).length > 0 && { user_data: userData }) })
}

/**
 * Fetch with an AbortController timeout.
 * Aborts the request if it doesn't complete within `timeoutMs` milliseconds.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

/**
 * Client identity derivation for abuse controls.
 *
 * Forwarding headers are only meaningful when a proxy we trust rewrites them.
 * Vercel overwrites `x-forwarded-for` / `x-real-ip` with the real peer address
 * and strips inbound `x-vercel-*` headers, so on Vercel they cannot be forged.
 * Off that platform we refuse to derive an identity instead of trusting a
 * client-supplied value, and callers fall back to a shared bucket.
 *
 * @module lib/request-identity
 */

/** Ordered by how hard the platform makes each header to forge. */
const FORWARDING_HEADERS = ["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"] as const

const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/
const IPV6 = /^(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$|^(?:[0-9a-f]{1,4}:){1,7}:$|^(?:[0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}$|^(?:[0-9a-f]{1,4}:){1,5}(?::[0-9a-f]{1,4}){1,2}$|^(?:[0-9a-f]{1,4}:){1,4}(?::[0-9a-f]{1,4}){1,3}$|^(?:[0-9a-f]{1,4}:){1,3}(?::[0-9a-f]{1,4}){1,4}$|^(?:[0-9a-f]{1,4}:){1,2}(?::[0-9a-f]{1,4}){1,5}$|^[0-9a-f]{1,4}:(?::[0-9a-f]{1,4}){1,6}$|^::(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4}$|^::$/

export function isIpAddress(value: string): boolean {
  return IPV4.test(value) || IPV6.test(value.toLowerCase())
}

/**
 * True when a proxy that sanitises forwarding headers sits in front of us.
 * `TRUST_PROXY_HEADERS` exists for self-hosting behind such a proxy; enabling
 * it without one re-introduces spoofable identities.
 */
export function isBehindTrustedProxy(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VERCEL === "1" || env.TRUST_PROXY_HEADERS === "true"
}

/**
 * Returns the client address, or null when no trusted proxy vouches for it.
 * A malformed value is treated as absent rather than used as a cache key.
 */
export function getTrustedClientIp(headers: Headers, env: NodeJS.ProcessEnv = process.env): string | null {
  if (!isBehindTrustedProxy(env)) return null

  for (const header of FORWARDING_HEADERS) {
    const value = headers.get(header)
    if (!value) continue
    // The trusted proxy writes the peer address first; later entries, if any,
    // are whatever the client sent and are ignored.
    const candidate = value.split(",")[0].trim()
    if (isIpAddress(candidate)) return candidate
  }
  return null
}

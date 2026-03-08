/**
 * Shared form utilities
 * @module lib/form-utils
 */

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

/**
 * Cookie consent store.
 *
 * The decision lives in localStorage rather than a cookie so that it is never
 * transmitted, and it is the single gate for every non-essential tag: nothing
 * that contacts a third party may load unless `hasTrackingConsent()` is true.
 *
 * @module lib/consent
 */

export const CONSENT_KEY = "cookie_consent";
export const CONSENT_UPDATED_AT_KEY = "cookie_consent_updated_at";
export const CONSENT_EVENT = "expansepi:cookie-consent-change";
/** Maximum age of consent decision before re-prompting (12 months in ms) */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** `null` means undecided; `"unknown"` is the pre-hydration server snapshot. */
export type ConsentState = "granted" | "denied" | null | "unknown";
export type ConsentDecision = Exclude<ConsentState, null | "unknown">;

/** Cookie name prefixes used by Google Analytics and Google Ads. */
const TRACKING_COOKIE_PREFIXES = ["_gcl", "_ga", "_gid", "_gac"];

export function hasTrackingConsent(): boolean {
    if (typeof window === "undefined") return false;
    return readConsent() === "granted";
}

/** Reads the stored decision, discarding it once it is older than the maximum age. */
export function readConsent(): ConsentState {
    if (typeof window === "undefined") return "unknown";

    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value !== "granted" && value !== "denied") return null;

    const updatedAt = window.localStorage.getItem(CONSENT_UPDATED_AT_KEY);
    if (updatedAt) {
        const age = Date.now() - new Date(updatedAt).getTime();
        if (age > CONSENT_MAX_AGE_MS) {
            clearStoredConsent();
            return null;
        }
    }

    return value;
}

/** Server render has no storage, so components start from a neutral state. */
export function getServerConsentSnapshot(): ConsentState {
    return "unknown";
}

export function subscribeToConsent(callback: () => void): () => void {
    if (typeof window === "undefined") return () => undefined;

    window.addEventListener("storage", callback);
    window.addEventListener(CONSENT_EVENT, callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(CONSENT_EVENT, callback);
    };
}

export function persistConsent(consent: ConsentDecision): void {
    window.localStorage.setItem(CONSENT_KEY, consent);
    window.localStorage.setItem(CONSENT_UPDATED_AT_KEY, new Date().toISOString());
    updateGoogleConsent(consent);
    if (consent === "denied") deleteTrackingCookies();
    window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Relays the decision to Google Consent Mode, if a tag is present. */
export function updateGoogleConsent(consent: ConsentDecision): void {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    const granted = consent === "granted";
    window.gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
    });
}

/**
 * Withdraws consent: the banner reappears, Google reverts to denied and any
 * identifiers already written are removed. Only cookies readable from
 * JavaScript can be deleted, which covers the Google tags this site loads.
 */
export function resetConsent(): void {
    if (typeof window === "undefined") return;
    clearStoredConsent();
    updateGoogleConsent("denied");
    deleteTrackingCookies();
    window.dispatchEvent(new Event(CONSENT_EVENT));
}

function clearStoredConsent(): void {
    window.localStorage.removeItem(CONSENT_KEY);
    window.localStorage.removeItem(CONSENT_UPDATED_AT_KEY);
}

function deleteTrackingCookies(): void {
    if (typeof document === "undefined") return;

    const { hostname } = window.location;
    const parent = hostname.split(".").slice(-2).join(".");
    // A cookie is only removed by a matching name/domain/path, and the tags use
    // both the exact host and the dot-prefixed registrable domain.
    const domains = [undefined, hostname, `.${hostname}`, parent, `.${parent}`];

    for (const entry of document.cookie.split(";")) {
        const name = entry.split("=")[0].trim();
        if (!name || !TRACKING_COOKIE_PREFIXES.some(prefix => name.startsWith(prefix))) continue;
        for (const domain of domains) {
            document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
        }
    }
}

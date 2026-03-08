export const CONSENT_KEY = "cookie_consent";
export const CONSENT_UPDATED_AT_KEY = "cookie_consent_updated_at";
export const CONSENT_EVENT = "expansepi:cookie-consent-change";
/** Maximum age of consent decision before re-prompting (12 months in ms) */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export function hasTrackingConsent(): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
}

/** Remove stored consent so the banner re-appears and gtag reverts to denied. */
export function resetConsent(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(CONSENT_KEY);
    window.localStorage.removeItem(CONSENT_UPDATED_AT_KEY);
    // Revoke Google consent immediately
    if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
        });
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
}

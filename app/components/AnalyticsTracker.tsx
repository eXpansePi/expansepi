"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getServerConsentSnapshot, readConsent, subscribeToConsent } from "@/lib/consent";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const consent = useSyncExternalStore(subscribeToConsent, readConsent, getServerConsentSnapshot);

    useEffect(() => {
        // Also runs when consent flips to granted, so the page the visitor
        // accepted on is recorded rather than skipped until the next route.
        if (consent !== "granted" || !pathname || typeof window === "undefined" || typeof window.gtag !== "function") {
            return;
        }

        window.gtag("event", "page_view", { page_path: pathname });
    }, [pathname, consent]);

    return null;
}

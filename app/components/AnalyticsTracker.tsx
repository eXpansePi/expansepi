"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function hasAnalyticsConsent() {
    if (typeof window === "undefined") {
        return false;
    }

    return window.localStorage.getItem("cookie_consent") === "granted";
}

export function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname || typeof window === "undefined" || typeof window.gtag !== "function") {
            return;
        }

        if (!hasAnalyticsConsent()) {
            return;
        }

            window.gtag('event', 'page_view', {
                page_path: pathname,
            });
    }, [pathname]);

    return null;
}

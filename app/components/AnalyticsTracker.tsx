"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { hasTrackingConsent } from "@/lib/consent";

export function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname || typeof window === "undefined" || typeof window.gtag !== "function") {
            return;
        }

        if (!hasTrackingConsent()) {
            return;
        }

            window.gtag('event', 'page_view', {
                page_path: pathname,
            });
    }, [pathname]);

    return null;
}

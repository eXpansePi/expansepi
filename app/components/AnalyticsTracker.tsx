"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && typeof window !== 'undefined' && typeof window.gtag === 'function') {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
            window.gtag('event', 'page_view', {
                page_path: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}

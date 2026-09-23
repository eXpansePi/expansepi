"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { getRoutePath } from "@/lib/routes";
import { type Language } from "@/i18n/config";
import { getServerConsentSnapshot, persistConsent, readConsent, subscribeToConsent } from "@/lib/consent";

interface CookieBannerProps {
    lang: string;
}

export function CookieBanner({ lang }: CookieBannerProps) {
    const consent = useSyncExternalStore(subscribeToConsent, readConsent, getServerConsentSnapshot);
    const noticeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const notice = noticeRef.current;
        if (!notice) return;
        const root = document.documentElement;

        function updateClearance() {
            const bounds = notice!.getBoundingClientRect();
            const bottomInset = Math.max(0, window.innerHeight - bounds.bottom);
            root.style.setProperty("--cookie-notice-space", `${Math.ceil(bounds.height + bottomInset + 12)}px`);
            const focused = document.activeElement;
            if (!(focused instanceof HTMLElement) || focused === document.body || notice!.contains(focused) || focused.closest("dialog[open]")) return;
            const target = focused.getBoundingClientRect();
            if (target.left < bounds.right && target.right > bounds.left && target.bottom > bounds.top && target.top < bounds.bottom) {
                focused.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
            }
        }

        const observer = new ResizeObserver(updateClearance);
        observer.observe(notice);
        window.addEventListener("resize", updateClearance);
        updateClearance();
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateClearance);
            root.style.removeProperty("--cookie-notice-space");
        };
    }, [consent]);

    const handleAccept = () => {
        persistConsent("granted");
    };

    const handleDecline = () => {
        persistConsent("denied");
    };

    if (consent !== null) return null;

    const translations = {
        cs: {
            title: "Soukromí a cookies",
            text: "Analytické a reklamní cookies zapneme jen s vaším souhlasem.",
            accept: "Povolit",
            decline: "Jen nezbytné",
            privacy: "Zásady ochrany osobních údajů"
        },
        en: {
            title: "Cookies and privacy",
            text: "Analytics and advertising cookies are used only with your consent.",
            accept: "Accept",
            decline: "Essential only",
            privacy: "Privacy policy"
        },
        ru: {
            title: "Cookies и конфиденциальность",
            text: "Аналитические и рекламные cookie включаются только с вашего согласия.",
            accept: "Принять",
            decline: "Только необходимые",
            privacy: "Политика конфиденциальности"
        }
    };

    const t = translations[lang as keyof typeof translations] || translations.cs;

    return (
        <aside ref={noticeRef} className="cookie-notice" aria-labelledby="cookie-title">
            <h2 id="cookie-title">{t.title}</h2>
            <p>{t.text} <Link href={getRoutePath(lang as Language, "gdpr")}>{t.privacy}</Link></p>
            <div className="cookie-actions"><button className="button button-secondary" onClick={handleDecline}>{t.decline}</button><button className="button button-primary" onClick={handleAccept}>{t.accept}</button></div>
        </aside>
    );
}

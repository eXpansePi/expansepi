"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { getRoutePath } from "@/lib/routes";
import { type Language } from "@/i18n/config";

const CONSENT_KEY = "cookie_consent";
const CONSENT_UPDATED_AT_KEY = "cookie_consent_updated_at";
const CONSENT_EVENT = "expansepi:cookie-consent-change";

type ConsentState = "granted" | "denied" | null | "unknown";

function getConsentSnapshot(): ConsentState {
    if (typeof window === "undefined") {
        return "unknown";
    }

    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "granted" || value === "denied") {
        return value;
    }

    return null;
}

function subscribeToConsent(callback: () => void) {
    if (typeof window === "undefined") {
        return () => undefined;
    }

    const handleChange = () => callback();
    window.addEventListener("storage", handleChange);
    window.addEventListener(CONSENT_EVENT, handleChange);

    return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener(CONSENT_EVENT, handleChange);
    };
}

function persistConsent(consent: Exclude<ConsentState, null | "unknown">) {
    window.localStorage.setItem(CONSENT_KEY, consent);
    window.localStorage.setItem(CONSENT_UPDATED_AT_KEY, new Date().toISOString());
    window.dispatchEvent(new Event(CONSENT_EVENT));
}

function updateGoogleConsent(consent: Exclude<ConsentState, null | "unknown">) {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
        return;
    }

    const granted = consent === "granted";
    window.gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
    });
}

interface CookieBannerProps {
    lang: string;
}

export function CookieBanner({ lang }: CookieBannerProps) {
    const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => "unknown");

    useEffect(() => {
        if (consent === "granted" || consent === "denied") {
            updateGoogleConsent(consent);
        }
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
            title: "Vaše soukromí je pro nás důležité",
            text: "Používáme analytické a reklamní cookies až po vašem souhlasu. Podrobnosti najdete v zásadách ochrany osobních údajů.",
            accept: "Povolit",
            decline: "Jen nezbytné",
            privacy: "Zásady ochrany osobních údajů"
        },
        en: {
            title: "Your privacy matters",
            text: "We only use analytics and advertising cookies after your consent. See the privacy policy for details.",
            accept: "Accept",
            decline: "Essential only",
            privacy: "Privacy policy"
        },
        ru: {
            title: "Ваша конфиденциальность важна",
            text: "Мы используем аналитические и рекламные cookie только после вашего согласия. Подробности смотрите в политике конфиденциальности.",
            accept: "Принять",
            decline: "Только необходимые",
            privacy: "Политика конфиденциальности"
        }
    };

    const t = translations[lang as keyof typeof translations] || translations.cs;

    return (
        <div className="fixed bottom-0 sm:bottom-6 sm:left-6 w-full sm:w-[420px] p-5 sm:p-6 bg-white/90 sm:bg-white/80 backdrop-blur-xl border-t sm:border border-gray-200 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] sm:shadow-2xl sm:rounded-2xl z-[999] flex flex-col gap-4 animate-[slideUp_400ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-sky-500" />

            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5 ring-1 ring-blue-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{t.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed pr-2">{t.text}</p>
                    <Link
                        href={getRoutePath(lang as Language, "gdpr")}
                        className="mt-2 inline-flex text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
                    >
                        {t.privacy}
                    </Link>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2 sm:mt-1">
                <button
                    onClick={handleDecline}
                    className="flex-1 w-full text-sm font-semibold text-gray-900 px-4 py-2.5 border border-gray-400 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                    {t.decline}
                </button>
                <button
                    onClick={handleAccept}
                    className="flex-1 w-full text-sm font-semibold text-white px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl border border-blue-700 transition-colors shadow-sm"
                >
                    {t.accept}
                </button>
            </div>
        </div>
    );
}

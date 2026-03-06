"use client";

import { useState, useEffect } from "react";

interface CookieBannerProps {
    lang: string;
}

export function CookieBanner({ lang }: CookieBannerProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if consent has already been given
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            setShow(true);
        } else if (consent === "granted") {
            // Hydrate default state if granted from previous session
            if (typeof window !== "undefined" && typeof window.gtag === "function") {
                window.gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'analytics_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                });
            }
        }
    }, []);

    const handleAccept = () => {
        // Update Google Ads consent
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag('consent', 'update', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });
        }
        localStorage.setItem("cookie_consent", "granted");
        setShow(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "denied");
        setShow(false);
    };

    if (!show) return null;

    const translations = {
        cs: {
            title: "Vaše soukromí je pro nás důležité",
            text: "Tento web používá cookies pro měření návštěvnosti a marketing. Souhlasíte s jejich použitím?",
            accept: "Povolit",
            decline: "Jen nezbytné"
        },
        en: {
            title: "Your privacy matters",
            text: "This site uses cookies for analytics and marketing. Do you accept their use?",
            accept: "Accept",
            decline: "Essential only"
        },
        ru: {
            title: "Ваша конфиденциальность важна",
            text: "Этот сайт использует файлы cookie для аналитики и маркетинга. Вы согласны с их использованием?",
            accept: "Принять",
            decline: "Только необходимые"
        }
    };

    const t = translations[lang as keyof typeof translations] || translations.cs;

    return (
        <div className="fixed bottom-0 sm:bottom-6 sm:left-6 w-full sm:w-[420px] p-5 sm:p-6 bg-white/90 sm:bg-white/80 backdrop-blur-xl border-t sm:border border-gray-200 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] sm:shadow-2xl sm:rounded-2xl z-[999] flex flex-col gap-4 animate-[slideUp_400ms_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5 ring-1 ring-blue-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{t.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed pr-2">{t.text}</p>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2 sm:mt-1">
                <button
                    onClick={handleDecline}
                    className="flex-1 w-full text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-white/60 transition-colors"
                >
                    {t.decline}
                </button>
                <button
                    onClick={handleAccept}
                    className="flex-1 w-full text-sm font-semibold text-white px-4 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all"
                >
                    {t.accept}
                </button>
            </div>
        </div>
    );
}

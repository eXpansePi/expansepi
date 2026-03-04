"use client"

import { useState } from "react"
import ApplyModal from "./ApplyModal"

interface ApplyButtonProps {
    courseTitle: string
    lang: string
    /** Visual variant */
    variant?: "hero" | "card" | "bottom"
}

function getLabel(lang: string) {
    if (lang === "en") return "Apply for the course"
    if (lang === "ru") return "Записаться на курс"
    return "Přihlásit se do kurzu"
}

export default function ApplyButton({ courseTitle, lang, variant = "hero" }: ApplyButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const label = getLabel(lang)

    const baseClasses =
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"

    const variants: Record<string, string> = {
        hero: `${baseClasses} px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm sm:text-base`,
        card: `${baseClasses} px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm`,
        bottom: `${baseClasses} px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-base sm:text-lg`,
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={variants[variant]}
            >
                {label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
            <ApplyModal
                courseTitle={courseTitle}
                lang={lang}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}

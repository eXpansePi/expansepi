"use client"

import { useState } from "react"

interface CourseFAQProps {
    faq: { question: string; answer: string }[]
    lang: string
}

const translations = {
    cs: { title: "Časté otázky" },
    en: { title: "Frequently Asked Questions" },
    ru: { title: "Часто задаваемые вопросы" },
}

export default function CourseFAQ({ faq, lang }: CourseFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const t = translations[lang as keyof typeof translations] || translations.cs

    return (
        <section className="px-4 sm:px-6 mb-8 sm:mb-10">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    {t.title}
                </h2>
                <div className="space-y-3">
                    {faq.map((item, index) => {
                        const isOpen = openIndex === index
                        return (
                            <div
                                key={index}
                                className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                                >
                                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                                        {item.question}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div
                                    className="overflow-hidden transition-all duration-300"
                                    style={{ maxHeight: isOpen ? "500px" : "0px" }}
                                >
                                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

"use client"

import { useState, FormEvent, useEffect } from "react"
import { createPortal } from "react-dom"

interface ApplyModalProps {
    courseTitle: string
    lang: string
    isOpen: boolean
    onClose: () => void
}

interface ModalTranslations {
    title: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    message: string
    send: string
    sending: string
    success: string
    error: string
    defaultMessage: (title: string) => string
}

function getTranslations(lang: string): ModalTranslations {
    const t: Record<string, ModalTranslations> = {
        cs: {
            title: "Přihlásit se do kurzu",
            name: "Jméno a příjmení",
            namePlaceholder: "Vaše jméno",
            email: "Email",
            emailPlaceholder: "vas@email.cz",
            phone: "Telefon",
            phonePlaceholder: "+420",
            message: "Zpráva",
            send: "Odeslat přihlášku",
            sending: "Odesílání...",
            success: "Přihláška byla úspěšně odeslána. Budeme Vás kontaktovat.",
            error: "Chyba při odesílání. Zkuste to prosím znovu.",
            defaultMessage: (title: string) =>
                `Dobrý den, rád bych se zařadil do rekvalifikačního kurzu "${title}".`,
        },
        en: {
            title: "Apply for the course",
            name: "Full Name",
            namePlaceholder: "Your name",
            email: "Email",
            emailPlaceholder: "your@email.com",
            phone: "Phone",
            phonePlaceholder: "+420",
            message: "Message",
            send: "Submit Application",
            sending: "Submitting...",
            success: "Application submitted successfully. We will contact you.",
            error: "Error submitting. Please try again.",
            defaultMessage: (title: string) =>
                `Hello, I would like to enroll in the course "${title}".`,
        },
        ru: {
            title: "Записаться на курс",
            name: "Имя и фамилия",
            namePlaceholder: "Ваше имя",
            email: "Email",
            emailPlaceholder: "ваш@email.com",
            phone: "Телефон",
            phonePlaceholder: "+420",
            message: "Сообщение",
            send: "Отправить заявку",
            sending: "Отправка...",
            success: "Заявка успешно отправлена. Мы свяжемся с вами.",
            error: "Ошибка при отправке. Пожалуйста, попробуйте снова.",
            defaultMessage: (title: string) =>
                `Здравствуйте, я хотел бы записаться на курс "${title}".`,
        },
    }
    return t[lang] || t.cs
}

export default function ApplyModal({ courseTitle, lang, isOpen, onClose }: ApplyModalProps) {
    const t = getTranslations(lang)
    const defaultMsg = t.defaultMessage(courseTitle)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: defaultMsg,
        surname: "",
    })
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: "",
                email: "",
                phone: "",
                message: defaultMsg,
                surname: "",
            })
            setStatus("idle")
        }
    }, [isOpen, defaultMsg])

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEsc)
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.removeEventListener("keydown", handleEsc)
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus("sending")

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: courseTitle,
                    message: formData.phone
                        ? `${formData.message}\n\nTelefon: ${formData.phone}`
                        : formData.message,
                    surname: formData.surname,
                }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setStatus("success")
                // Auto-close after a delay
                setTimeout(() => {
                    onClose()
                }, 3000)
            } else {
                setStatus("error")
                setTimeout(() => setStatus("idle"), 5000)
            }
        } catch {
            setStatus("error")
            setTimeout(() => setStatus("idle"), 5000)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    if (!isOpen || !mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_300ms_ease-out]">
                {/* Accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-sky-400" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6 sm:p-8">
                    {/* Title */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t.title}</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{courseTitle}</p>
                        </div>
                    </div>

                    {/* Success state */}
                    {status === "success" ? (
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mb-1">{t.success}</p>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            {/* Honeypot field (hidden from real users) */}
                            <div className="hidden" aria-hidden="true">
                                <label htmlFor="apply-surname">Příjmení</label>
                                <input
                                    type="text"
                                    id="apply-surname"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label htmlFor="apply-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    {t.name}
                                </label>
                                <input
                                    type="text"
                                    id="apply-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder={t.namePlaceholder}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                                />
                            </div>

                            {/* Email & Phone side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Email */}
                                <div>
                                    <label htmlFor="apply-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        {t.email}
                                    </label>
                                    <input
                                        type="email"
                                        id="apply-email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.emailPlaceholder}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="apply-phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        {t.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        id="apply-phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder={t.phonePlaceholder}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="apply-message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    {t.message}
                                </label>
                                <textarea
                                    id="apply-message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                                />
                            </div>

                            {/* Error message */}
                            {status === "error" && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {t.error}
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {status === "sending" ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        {t.sending}
                                    </>
                                ) : (
                                    <>
                                        {t.send}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Global keyframe animations */}
            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>,
        document.body
    )
}

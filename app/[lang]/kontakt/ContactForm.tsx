"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { getRoutePath } from "@/lib/routes"
import { type Language } from "@/i18n/config"

interface ContactFormProps {
  lang: string
  t: any
}

export default function ContactForm({ lang, t }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    surname: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("sending")

    try {
      // Send email via API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.phone
            ? `${formData.message}\n\nTelefon: ${formData.phone}`
            : formData.message,
          surname: formData.surname,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Open mailto link only if email wasn't sent via Resend (fallback mode)
        if (data.mailtoLink) {
          window.location.href = data.mailtoLink
        }

        setStatus("success")
        // Clear form after showing success message
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "", phone: "", surname: "" })
        }, 2000)

        // Reset status after 8 seconds
        setTimeout(() => setStatus("idle"), 8000)
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 5000)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400" />
      <div className="p-5 sm:p-8 flex-grow flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{t.contact.form.title}</h2>

        {status === "success" ? (
          <div className="flex-grow flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1 text-center">{t.contact.form.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            {/* Honeypot field (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="surname">Příjmení</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t.contact.form.namePlaceholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t.contact.form.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="^\+?[0-9\s\-()]{7,15}$"
                  title={lang === 'cs' ? 'Zadejte platné telefonní číslo obsaující číslice.' : 'Please enter a valid phone number containing digits.'}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                  placeholder="+420 123 456 789"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  minLength={5}
                  placeholder={t.contact.form.emailPlaceholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t.contact.form.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder={t.contact.form.subjectPlaceholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={t.contact.form.messagePlaceholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-gray-900 placeholder:text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                />
              </div>

              {status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {t.contact.form.error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {status === "sending" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.contact.form.sending}
                </>
              ) : (
                <>
                  {t.contact.form.send}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {/* GDPR Consent Info */}
            <p className="text-xs text-gray-500 text-center mt-4">
              {lang === 'cs' ? (
                <>Odesláním formuláře souhlasím se <Link href={getRoutePath(lang as Language, 'gdpr')} target="_blank" className="underline hover:text-gray-700">zpracováním osobních údajů.</Link></>
              ) : lang === 'en' ? (
                <>By submitting this form, I agree to the <Link href={getRoutePath(lang as Language, 'gdpr')} target="_blank" className="underline hover:text-gray-700">processing of personal data.</Link></>
              ) : (
                <>Отправляя форму, я соглашаюсь на <Link href={getRoutePath(lang as Language, 'gdpr')} target="_blank" className="underline hover:text-gray-700">обработку персональных данных.</Link></>
              )}
            </p>
          </form>
        )}
      </div>
    </article>
  )
}

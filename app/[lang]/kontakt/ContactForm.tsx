"use client"

import { useState, FormEvent } from "react"

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
        body: JSON.stringify(formData),
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
          setFormData({ name: "", email: "", subject: "", message: "" })
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
    <div className="glow-box bg-white rounded-lg p-3 sm:p-4 shadow-sm h-full flex flex-col">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">{t.contact.form.title}</h2>
      
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t.contact.form.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t.contact.form.emailPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {status === "success" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs sm:text-sm text-green-800">
              {t.contact.form.success}
            </div>
          )}

          {status === "error" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-800">
              {t.contact.form.error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full px-4 sm:px-5 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
        >
          {status === "sending" ? t.contact.form.sending : t.contact.form.send}
        </button>
      </form>
    </div>
  )
}


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

    // For now, we'll use mailto as a fallback
    // In production, you'd want to create an API route to handle email sending
    const mailtoLink = `mailto:contact@expansepi.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`
    
    // Try to open mailto link
    // Note: We cannot reliably detect if the email client opened or if the user sent the email
    // So we show a message indicating the email client should open, and clear the form
    // Using window.location.href is the standard way to open mailto links
    try {
      window.location.href = mailtoLink
      
      // Show a message that the email client should open
      // We don't claim "success" since we can't verify the email was actually sent
      // Note: We clear the form to provide feedback, but the message makes it clear
      // the user needs to manually send the email
      setTimeout(() => {
        setStatus("success")
        // Clear form after showing the message, but keep it visible briefly
        // so user can see what was prepared
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "" })
        }, 2000)
        
        // Reset status after 8 seconds to give user time to read the message
        setTimeout(() => setStatus("idle"), 8000)
      }, 300)
    } catch (error) {
      // This catch is unlikely to trigger, but handle it gracefully
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
    <div className="glow-box bg-white rounded-lg p-3 sm:p-4 shadow-sm">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">{t.contact.form.title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
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

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full px-4 sm:px-5 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? t.contact.form.sending : t.contact.form.send}
        </button>
      </form>
    </div>
  )
}


"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowUpRight, CheckCircle2, ChevronDown, LoaderCircle } from "lucide-react"
import type { Language } from "@/i18n/config"
import { getRoutePath } from "@/lib/routes"
import { fetchWithTimeout, trackApplicationConversion } from "@/lib/form-utils"

const labels = {
  cs: {
    name: "Jméno a příjmení", email: "E-mail", phone: "Telefon", message: "Na co se chcete zeptat?", optional: "volitelné", course: "Co vás zajímá?", undecided: "Potřebuji poradit s výběrem", send: "Odeslat nezávazný zájem", sending: "Odesíláme…", success: "Děkujeme. Zpráva je u nás.", successNote: "Ozveme se vám a probereme kurz, termín, cenu a případné financování. Odeslání není platba ani potvrzení místa.", error: "Zprávu se nepodařilo odeslat. Vaše údaje zůstaly vyplněné. Zkuste to znovu nebo nám napište na", limited: "Příliš mnoho pokusů. Zkuste to za chvíli nebo nám napište na", privacy: "Informace o zpracování údajů najdete v", policy: "zásadách ochrany osobních údajů", another: "Napsat další zprávu", subject: "Zájem o IT kurzy", defaultMessage: "Mám zájem o informace a další postup.", required: "Vyplňte prosím své jméno.",
  },
  en: {
    name: "Full name", email: "Email", phone: "Phone", message: "What would you like to ask?", optional: "optional", course: "What interests you?", undecided: "Help me choose a course", send: "Send a nonbinding enquiry", sending: "Sending…", success: "Thank you. Your message is with us.", successNote: "We will contact you to discuss the course, dates, price and possible funding. This is not a payment or confirmation of a place.", error: "Your message could not be sent. Your details are still here. Try again or email us at", limited: "Too many attempts. Please try again shortly or email us at", privacy: "Read how we process your details in our", policy: "privacy policy", another: "Write another message", subject: "IT course enquiry", defaultMessage: "I would like information about the course and next steps.", required: "Please enter your name.",
  },
  ru: {
    name: "Имя и фамилия", email: "E-mail", phone: "Телефон", message: "О чём вы хотите спросить?", optional: "необязательно", course: "Что вас интересует?", undecided: "Помогите выбрать курс", send: "Отправить заявку без обязательств", sending: "Отправляем…", success: "Спасибо. Мы получили сообщение.", successNote: "Свяжемся с вами и обсудим курс, даты, цену и финансирование. Отправка не является оплатой или подтверждением места.", error: "Не удалось отправить сообщение. Ваши данные сохранены в форме. Попробуйте снова или напишите на", limited: "Слишком много попыток. Попробуйте позже или напишите на", privacy: "Информация об обработке данных в", policy: "политике конфиденциальности", another: "Написать ещё", subject: "Интерес к IT-курсам", defaultMessage: "Хочу узнать о курсе и дальнейших шагах.", required: "Пожалуйста, укажите имя.",
  },
}

interface EnquiryFormProps {
  lang: Language
  courseTitle?: string
  courses?: { slug: string; title: string }[]
}

export default function EnquiryForm({ lang, courseTitle, courses = [] }: EnquiryFormProps) {
  const copy = labels[lang]
  const id = useId()
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "limited">("idle")
  const successMessage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "success") successMessage.current?.focus()
  }, [status])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending") return
    const form = event.currentTarget
    const values = new FormData(form)
    const name = String(values.get("name") || "").trim()
    if (!name) {
      const input = form.elements.namedItem("name") as HTMLInputElement
      input.setCustomValidity(copy.required)
      input.reportValidity()
      return
    }
    const email = String(values.get("email") || "").trim()
    const phone = String(values.get("phone") || "").trim()
    const surname = String(values.get("surname") || "")
    const selected = courses.find(course => course.slug === values.get("course"))
    const subject = courseTitle || selected?.title || copy.subject
    const message = String(values.get("message") || "").trim() || copy.defaultMessage
    setStatus("sending")

    try {
      const response = await fetchWithTimeout("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, subject, message, surname }),
      }, 10000)
      const result = await response.json()
      if (!response.ok || result.success !== true) {
        setStatus(response.status === 429 ? "limited" : "error")
        return
      }
      setStatus("success")
      if (courseTitle || selected) void trackApplicationConversion(email, phone, surname)
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return <div ref={successMessage} className="form-success" role="status" aria-live="polite" tabIndex={-1}><CheckCircle2 aria-hidden="true" /><h3>{copy.success}</h3><p>{copy.successNote}</p><button className="button button-secondary" onClick={() => setStatus("idle")}>{copy.another}<ArrowUpRight aria-hidden="true" /></button></div>
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} aria-busy={status === "sending"}>
      <div hidden aria-hidden="true"><label htmlFor={`${id}-surname`}>Surname</label><input id={`${id}-surname`} name="surname" tabIndex={-1} autoComplete="off" /></div>
      {!courseTitle && <div className="field"><label htmlFor={`${id}-course`}>{copy.course}</label><div className="select-field"><select name="course" id={`${id}-course`} defaultValue=""><option value="">{copy.undecided}</option>{courses.map(course => <option key={course.slug} value={course.slug}>{course.title}</option>)}</select><ChevronDown aria-hidden="true" /></div></div>}
      <div className="field"><label htmlFor={`${id}-name`}>{copy.name}</label><input id={`${id}-name`} name="name" autoComplete="name" required maxLength={100} onInput={event => event.currentTarget.setCustomValidity("")} /></div>
      <div className="field"><label htmlFor={`${id}-email`}>{copy.email}</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required minLength={5} maxLength={100} /></div>
      <div className="field"><label htmlFor={`${id}-phone`}>{copy.phone}<span>{copy.optional}</span></label><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={20} pattern="\+?[0-9\s\-\(\)]{7,15}" /></div>
      <div className="field"><label htmlFor={`${id}-message`}>{copy.message}<span>{copy.optional}</span></label><textarea id={`${id}-message`} name="message" rows={3} maxLength={5000} /></div>
      {(status === "error" || status === "limited") && <p className="form-status form-error" role="alert">{copy[status]} <a href="mailto:info@expansepi.com">info@expansepi.com</a>.</p>}
      <button className="button button-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? <><LoaderCircle className="loading-spinner" aria-hidden="true" />{copy.sending}</> : <>{copy.send}<ArrowUpRight aria-hidden="true" /></>}</button>
      <p className="form-privacy">{copy.privacy} <Link href={getRoutePath(lang, "gdpr")}>{copy.policy}</Link>.</p>
    </form>
  )
}
import { isValidLanguage } from "@/i18n/config"
import type { Translations } from "@/i18n/index"
import { getActiveCourses } from "@/data/courses"
import EnquiryForm from "../components/EnquiryForm"

export default function ContactForm({ lang, t }: { lang: string; t: Translations }) {
  const language = isValidLanguage(lang) ? lang : "cs"
  const courses = getActiveCourses(language).map(({ slug, title }) => ({ slug, title }))
  return <div className="contact-form-panel"><h2 className="contact-form-heading">{t.contact.form.title}</h2><EnquiryForm lang={language} courses={courses} /></div>
}
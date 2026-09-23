import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import ContactForm from "./ContactForm"
import { getTranslations } from "@/i18n/index"
import { getSiteCopy } from "@/i18n/site"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"

interface ContactPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang: routeLang } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const t = getTranslations(lang)
  const description = getSiteCopy(lang).contact.intro
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"
  const routes = getAllRoutePaths("contact")
  const url = `${baseUrl}${routes[lang]}`
  return { title: t.contact.title, description, alternates: { canonical: url, languages: { cs: `${baseUrl}${routes.cs}`, en: `${baseUrl}${routes.en}`, ru: `${baseUrl}${routes.ru}`, "x-default": `${baseUrl}${routes.cs}` } }, openGraph: { title: t.contact.title, description, url, siteName: "eXpansePi", type: "website", locale: lang === "cs" ? "cs_CZ" : lang === "en" ? "en_US" : "ru_RU" } }
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang: routeLang } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const t = getTranslations(lang)
  const copy = getSiteCopy(lang)

  return <><Navigation activePage={getRoutePath(lang, "contact")} lang={lang} t={t} /><main id="main-content" className="site-main">
    <section className="page-intro"><div className="container"><p className="eyebrow">{copy.contact.eyebrow}</p><h1>{copy.contact.title}</h1><p className="lead">{copy.contact.intro}</p></div></section>
    <section className="section"><div className="container contact-layout">
      <div className="contact-aside">
      <h2 className="contact-form-heading">{t.contact.contactInfo}</h2>
      <dl className="contact-details">
        <div className="contact-primary"><dt>{t.contact.email}</dt><dd><a className="contact-main-link" href="mailto:info@expansepi.com">info@expansepi.com</a></dd></div>
        <div className="contact-primary"><dt>{t.contact.phone}</dt><dd><a className="contact-main-link" href="tel:+420775715700">+420 775 715 700</a></dd></div>
        <div><dt>{t.contact.address}</dt><dd>{t.contact.addressValue}</dd></div>
        <div><dt>{t.contact.teachingLocation}</dt><dd>{t.contact.teachingLocationValue}<br /><a className="contact-map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.contact.teachingLocationValue)}`} target="_blank" rel="noopener noreferrer">{copy.contact.directions}<ArrowUpRight size={14} aria-hidden="true" /></a></dd></div>
      </dl>
      <dl className="contact-details contact-legal">
        <div><dt>{t.contact.ico}</dt><dd>{t.contact.icoValue}</dd></div>
        <div><dt>{t.contact.bankAccount}</dt><dd>{t.contact.bankAccountValue}</dd></div>
      </dl>
      </div>
      <ContactForm lang={lang} t={t} />
    </div></section>
  </main><Footer lang={lang} /></>
}
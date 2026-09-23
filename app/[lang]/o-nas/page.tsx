import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import PartnerSection from "../components/PartnerSection"
import { ApplicationSection, SectionHeading, TeamSection } from "../components/CourseSections"
import { getTranslations } from "@/i18n/index"
import { getSiteCopy } from "@/i18n/site"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"

interface AboutPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang: routeLang } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const title = getTranslations(lang).about.title
  const description = getSiteCopy(lang).about.intro
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"
  const routes = getAllRoutePaths("about")
  const url = `${baseUrl}${routes[lang]}`
  return { title, description, alternates: { canonical: url, languages: { cs: `${baseUrl}${routes.cs}`, en: `${baseUrl}${routes.en}`, ru: `${baseUrl}${routes.ru}`, "x-default": `${baseUrl}${routes.cs}` } }, openGraph: { title, description, url, siteName: "eXpansePi", type: "website", locale: lang === "cs" ? "cs_CZ" : lang === "en" ? "en_US" : "ru_RU" } }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang: routeLang } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const t = getTranslations(lang)
  const copy = getSiteCopy(lang)

  return <><Navigation activePage={getRoutePath(lang, "about")} lang={lang} t={t} /><main id="main-content" className="site-main">
    <section className="page-intro"><div className="container"><p className="eyebrow">{copy.about.eyebrow}</p><h1>{copy.about.title}</h1><p className="lead">{copy.about.intro}</p></div></section>
    <TeamSection lang={lang} full />
    <section className="section surface-section" aria-labelledby="principles-title"><div className="container"><SectionHeading title={copy.about.principlesTitle} id="principles-title" /><div className="audience-grid">{copy.about.principles.map(principle => <div className="audience-item" key={principle.title}><h3>{principle.title}</h3><p>{principle.text}</p></div>)}</div></div></section>
    <PartnerSection lang={lang} />
    <ApplicationSection lang={lang} />
  </main><Footer lang={lang} /></>
}
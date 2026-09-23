import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getOpenVacancies } from "@/data/vacancies"
import { VacancyCard } from "./components"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"

const localeMap: Record<string, string> = { cs: 'cs_CZ', en: 'en_US', ru: 'ru_RU' }

interface VacanciesPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: VacanciesPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const allRoutes = getAllRoutePaths('vacancies')

  return {
    title: t.vacancies.title,
    description: t.vacancies.description,
    alternates: {
      canonical: `${baseUrl}${allRoutes[lang]}`,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`,
        'x-default': `${baseUrl}${allRoutes.cs}`,
      },
    },
    openGraph: {
      title: t.vacancies.title,
      description: t.vacancies.description,
      url: `${baseUrl}${allRoutes[lang]}`,
      siteName: 'eXpansePi',
      locale: localeMap[lang],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.vacancies.title,
      description: t.vacancies.description,
    },
  }
}

export default async function VacanciesPage({ params }: VacanciesPageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const openVacancies = getOpenVacancies(lang)

  return (
    <>
      <Navigation activePage={getRoutePath(lang, 'vacancies')} lang={lang} t={t} />
      <main id="main-content" className="site-main">
        <section className="page-intro"><div className="container"><p className="eyebrow">eXpansePi / {t.common.vacancies}</p><h1>{t.vacancies.title}</h1><p className="lead">{t.vacancies.description}</p></div></section>
        <section className="section" aria-label={t.vacancies.title}><div className="container">
          {openVacancies.length > 0 ? (
            <div className="editorial-list">
              {openVacancies.map(vacancy => (
                <VacancyCard key={vacancy.slug} vacancy={vacancy} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="vacancies-empty">
              <p className="reading-copy">{t.vacancies.noVacancies}</p>
            </div>
          )}
        </div></section>
      </main>
      <Footer lang={lang} />
    </>
  )
}

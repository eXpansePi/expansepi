import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Markdown from "react-markdown"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import { JsonLd } from "@/app/components/JsonLd"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getOpenVacancies, getVacancyBySlug } from "@/data/vacancies"
import { getJobPostingSchema, getBreadcrumbSchema } from "@/lib/seo"
import { getRoutePath, getDetailRoutePath, getAllDetailRoutePaths } from "@/lib/routes"

interface VacancyDetailProps {
  params: Promise<{ lang: string; slug: string }>
}

export function generateStaticParams() {
  // Generate params for all languages - we need to check each language separately
  const allParams: { lang: string; slug: string }[] = []
  for (const lang of ['cs', 'en', 'ru'] as const) {
    const vacancies = getOpenVacancies(lang)
    for (const vacancy of vacancies) {
      allParams.push({ lang, slug: vacancy.slug })
    }
  }
  return allParams
}

export async function generateMetadata({ params }: VacancyDetailProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const vacancy = getVacancyBySlug(resolvedParams.slug, lang)

  if (!vacancy || vacancy.status !== 'open') {
    return { title: t.common.notFound }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const vacancyUrl = `${baseUrl}${getDetailRoutePath(lang, 'vacancies', vacancy.slug)}`
  const allRoutes = getAllDetailRoutePaths('vacancies', vacancy.slug)

  return {
    title: vacancy.title,
    description: vacancy.description,
    alternates: {
      canonical: vacancyUrl,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`,
        'x-default': `${baseUrl}${allRoutes.cs}`
      }
    },
    openGraph: {
      title: vacancy.title,
      description: vacancy.description,
      url: vacancyUrl,
      siteName: 'eXpansePi',
      locale: lang === 'cs' ? 'cs_CZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: vacancy.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: vacancy.title,
      description: vacancy.description,
      images: [`${baseUrl}/og-image.jpg`],
    }
  }
}

export default async function VacancyDetail({ params }: VacancyDetailProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const vacancy = getVacancyBySlug(resolvedParams.slug, lang)

  if (!vacancy || vacancy.status !== 'open') {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const jobSchema = getJobPostingSchema(vacancy, lang)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t.common.home, url: `${baseUrl}/${lang}` },
    { name: t.common.vacancies, url: `${baseUrl}${getRoutePath(lang, 'vacancies')}` },
    { name: vacancy.title, url: `${baseUrl}${getDetailRoutePath(lang, 'vacancies', vacancy.slug)}` },
  ])

  return (
    <>
      <JsonLd data={jobSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navigation activePage={getRoutePath(lang, 'vacancies')} lang={lang} t={t} />
      <main id="main-content" className="site-main">
        <article>
          <header className="page-intro"><div className="article-container"><Link href={getRoutePath(lang, "vacancies")} className="text-link article-back"><ArrowLeft aria-hidden="true" />{t.common.vacancies}</Link><h1>{vacancy.title}</h1><div className="article-meta"><span className="tag tag-blue">{vacancy.employmentType}</span><span className="tag">{vacancy.workMode}</span></div></div></header>
          <div className="article-container article-content reading-content">
            <p className="lead">{vacancy.description}</p>
            {vacancy.details && (
              <Markdown skipHtml>{vacancy.details}</Markdown>
            )}
            <div className="article-bottom button-row">
              <a className="button button-primary" href={`mailto:info@expansepi.com?subject=${encodeURIComponent(vacancy.title)}`}>{t.common.applyNow}<ArrowUpRight aria-hidden="true" /></a>
              <Link href={getRoutePath(lang, "vacancies")} className="text-link"><ArrowLeft aria-hidden="true" />{t.common.backToList}</Link>
            </div>
          </div>
        </article>
      </main>
      <Footer lang={lang} />
    </>
  )
}

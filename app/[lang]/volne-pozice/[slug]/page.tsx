import type { Metadata } from "next"
import Navigation from "../../components/Navigation"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getOpenVacancies, getVacancyBySlug } from "@/data/vacancies"
import { getJobPostingSchema, getBreadcrumbSchema } from "@/lib/seo"

interface VacancyDetailProps {
  params: Promise<{ lang: string; slug: string }>
}

export function generateStaticParams() {
  return getOpenVacancies().flatMap(vacancy =>
    ['cs', 'en', 'ru'].map(lang => ({
      lang,
      slug: vacancy.slug
    }))
  )
}

export async function generateMetadata({ params }: VacancyDetailProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const vacancy = getVacancyBySlug(resolvedParams.slug)

  if (!vacancy || vacancy.status !== 'open') {
    return { title: t.common.notFound }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const vacancyUrl = `${baseUrl}/${lang}/volne-pozice/${vacancy.slug}`

  return {
    title: vacancy.title,
    description: vacancy.description,
    alternates: {
      canonical: vacancyUrl,
      languages: {
        'cs': `${baseUrl}/cs/volne-pozice/${vacancy.slug}`,
        'en': `${baseUrl}/en/volne-pozice/${vacancy.slug}`,
        'ru': `${baseUrl}/ru/volne-pozice/${vacancy.slug}`
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
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const vacancy = getVacancyBySlug(resolvedParams.slug)

  if (!vacancy || vacancy.status !== 'open') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation activePage={`/${lang}/volne-pozice`} lang={lang} t={t} />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t.common.notFound}</h1>
            <a href={`/${lang}/volne-pozice`} className="text-blue-600 font-semibold hover:underline">{t.common.backToList}</a>
          </div>
        </main>
      </div>
    )
  }

  const jobSchema = getJobPostingSchema(vacancy, lang)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t.common.home, url: `https://expansepi.com/${lang}` },
    { name: t.common.vacancies, url: `https://expansepi.com/${lang}/volne-pozice` },
    { name: vacancy.title, url: `https://expansepi.com/${lang}/volne-pozice/${vacancy.slug}` },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navigation activePage={`/${lang}/volne-pozice`} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{vacancy.title}</h1>
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{vacancy.employmentType}</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">{vacancy.workMode}</span>
          </div>
          <div className="prose prose-sm sm:prose-base prose-gray max-w-none mb-5 sm:mb-6">
            <p className="text-sm sm:text-base leading-relaxed">{vacancy.description}</p>
            {vacancy.details && (
              <div dangerouslySetInnerHTML={{ __html: vacancy.details }} />
            )}
          </div>
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                {t.common.applyNow}
              </button>
              <a href={`/${lang}/volne-pozice`} className="w-full sm:w-auto text-center sm:text-left text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center justify-center gap-2 text-xs sm:text-sm">
                ← {t.common.backToList}
              </a>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

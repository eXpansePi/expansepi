import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getOpenVacancies } from "@/data/vacancies"
import { VacancyCard } from "./components"
import { getRoutePath } from "@/lib/routes"

interface VacanciesPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: VacanciesPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  return {
    title: t.vacancies.title,
    description: t.vacancies.title,
  }
}

export default async function VacanciesPage({ params }: VacanciesPageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const openVacancies = getOpenVacancies(lang)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage={getRoutePath(lang, 'vacancies')} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">{t.vacancies.title}</h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t.vacancies.description}</p>

          {openVacancies.length > 0 ? (
            <div className="space-y-4 sm:space-y-5">
              {openVacancies.map(vacancy => (
                <VacancyCard key={vacancy.slug} vacancy={vacancy} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10">
              <p className="text-base sm:text-lg text-gray-600">{t.vacancies.noVacancies}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

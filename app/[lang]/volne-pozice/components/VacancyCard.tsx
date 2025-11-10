import Link from "next/link"
import { Vacancy } from "@/types/vacancy"
import { getDetailRoutePath } from "@/lib/routes"
import { type Language } from "@/i18n/config"

interface VacancyCardProps {
  vacancy: Vacancy
  lang: string
}

export default function VacancyCard({ vacancy, lang }: VacancyCardProps) {
  return (
    <article className="glow-box bg-white rounded-lg shadow-md p-4 sm:p-5 hover:shadow-xl transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{vacancy.title}</h2>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">
              {vacancy.employmentType}
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-semibold">
              {vacancy.workMode}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">{vacancy.description}</p>
      <Link
        href={getDetailRoutePath(lang as Language, 'vacancies', vacancy.slug)}
        className="text-sm sm:text-base text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
      >
        {lang === 'cs' ? 'Více informací' : lang === 'en' ? 'More information' : 'Подробнее'} →
      </Link>
    </article>
  )
}

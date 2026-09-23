import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Vacancy } from "@/types/vacancy"
import { getDetailRoutePath } from "@/lib/routes"
import { type Language } from "@/i18n/config"

interface VacancyCardProps {
  vacancy: Vacancy
  lang: string
}

export default function VacancyCard({ vacancy, lang }: VacancyCardProps) {
  return (
    <article className="editorial-item">
          <div className="editorial-meta">
            <span className="tag tag-blue">
              {vacancy.employmentType}
            </span>
            <span className="tag">
              {vacancy.workMode}
            </span>
          </div>
      <div className="editorial-body"><h2>{vacancy.title}</h2><p className="reading-copy">{vacancy.description}</p></div>
      <Link
        href={getDetailRoutePath(lang as Language, 'vacancies', vacancy.slug)}
        className="text-link editorial-action"
        aria-label={`${lang === 'cs' ? 'Více informací' : lang === 'en' ? 'More information' : 'Подробнее'}: ${vacancy.title}`}
      >
        {lang === 'cs' ? 'Více informací' : lang === 'en' ? 'More information' : 'Подробнее'}<ArrowUpRight aria-hidden="true" />
      </Link>
    </article>
  )
}

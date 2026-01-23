import Link from "next/link"
import Image from "next/image"
import { Course } from "@/types/course"
import { COURSE_STATUS_CONFIG, COURSE_LEVEL_CONFIG } from "@/lib/course-constants"
import { getDetailRoutePath } from "@/lib/routes"
import { type Language } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"

interface CourseCardProps {
  course: Course
  lang: string
}

export default function CourseCard({ course, lang }: CourseCardProps) {
  const isDraft = course.status === 'upcoming'
  const config = COURSE_STATUS_CONFIG[course.status]
  const levelConfig = COURSE_LEVEL_CONFIG[course.level] || {
    color: 'gray',
    badgeClass: 'bg-gray-100 text-gray-700'
  }
  const t = getTranslations(lang as Language)

  return (
    <article
      className={`glow-box bg-white rounded-xl shadow-lg p-4 sm:p-5 transition-all duration-300 flex flex-col ${isDraft ? 'opacity-90' : 'hover:shadow-xl'
        }`}
    >
      {/* Course Image */}
      {course.image && (
        <div className="mb-3 flex items-center justify-center h-16 sm:h-20 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg relative">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 4rem, 5rem"
          />
        </div>
      )}

      {/* Accreditation Badge */}
      {course.accreditation && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {lang === 'cs' ? 'Akreditováno MŠMT' : lang === 'en' ? 'MŠMT Accredited' : 'Аккредитовано МШМТ'}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div className="mb-2 sm:mb-0 flex-grow">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">{course.title}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.duration}</span>
            </div>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className={`px-1.5 py-0.5 rounded text-xs ${levelConfig.badgeClass}`}>
              {course.level}
            </span>
          </div>
          {!isDraft && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="text-lg sm:text-xl font-bold text-gray-900">
                {t.courses.price}
              </div>
              {course.funding && (
                <div className="flex items-center gap-1.5 bg-green-100 border-2 border-green-300 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs sm:text-sm font-semibold text-green-800 whitespace-nowrap">{course.funding}</p>
                </div>
              )}
            </div>
          )}
        </div>
        {isDraft && (
          <span className={`text-xs px-2 py-0.5 rounded ${config.badgeClass} whitespace-nowrap`}>
            {config.label}
          </span>
        )}
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed flex-grow">{course.description}</p>
      {course.status === 'active' ? (
        <Link
          href={getDetailRoutePath(lang as Language, 'courses', course.slug)}
          className="text-sm sm:text-base text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
        >
          {lang === 'cs' ? 'Více informací' : lang === 'en' ? 'More information' : 'Подробнее'} →
        </Link>
      ) : (
        <span className="text-sm sm:text-base text-gray-400 font-semibold">
          {lang === 'cs' ? 'Připravujeme' : lang === 'en' ? 'Coming soon' : 'Готовится'}
        </span>
      )}
    </article>
  )
}

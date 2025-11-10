import type { Metadata } from "next"
import Navigation from "../../components/Navigation"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import coursesData from "@/data/courses.json"
import { getCourseSchema, getBreadcrumbSchema } from "@/lib/seo"
import ExpandableSyllabus from "./components/ExpandableSyllabus"
import { getRoutePath, getDetailRoutePath, getAllDetailRoutePaths } from "@/lib/routes"

interface CourseDetailProps {
  params: Promise<{ lang: string; slug: string }>
}

interface MultilingualCourseData {
  title: string
  description: string
  duration: string
  level: string
  accreditation?: string
  syllabus?: string[]
  form?: string
  exam?: string
  certification?: string
  funding?: string
  highlights?: string[]
}

function getCourseData(slug: string, lang: Language): MultilingualCourseData | null {
  const course = (coursesData as any[]).find((c: any) => c.slug === slug)
  if (!course) return null

  // Check if course has multilingual structure
  if (course.languages && course.languages[lang]) {
    return course.languages[lang]
  }

  // Fallback to old structure for backward compatibility
  if (course.title) {
    return {
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      accreditation: course.accreditation,
      syllabus: course.syllabus,
    }
  }

  return null
}

export function generateStaticParams() {
  const courses = (coursesData as any[])
  return courses.flatMap(course => {
    // Check if course has multilingual structure
    if (course.languages) {
      return ['cs', 'en', 'ru'].map(lang => ({
        lang,
        slug: course.slug
      }))
    }
    // For old structure, generate for all languages
    return ['cs', 'en', 'ru'].map(lang => ({
      lang,
      slug: course.slug
    }))
  })
}

export async function generateMetadata({ params }: CourseDetailProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const courseData = getCourseData(resolvedParams.slug, lang)
  
  if (!courseData) {
    const t = getTranslations(lang)
    return { title: t.common.notFound }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const courseUrl = `${baseUrl}${getDetailRoutePath(lang, 'courses', resolvedParams.slug)}`
  const allRoutes = getAllDetailRoutePaths('courses', resolvedParams.slug)

  return {
    title: courseData.title,
    description: courseData.description,
    alternates: {
      canonical: courseUrl,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`
      }
    },
    openGraph: {
      title: courseData.title,
      description: courseData.description,
      url: courseUrl,
      siteName: 'eXpansePi',
      locale: lang === 'cs' ? 'cs_CZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: courseData.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: courseData.title,
      description: courseData.description,
      images: [`${baseUrl}/og-image.jpg`],
    }
  }
}

export default async function CourseDetail({ params }: CourseDetailProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const courseData = getCourseData(resolvedParams.slug, lang)

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation activePage={getRoutePath(lang, 'courses')} lang={lang} t={t} />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t.common.notFound}</h1>
            <a href={getRoutePath(lang, 'courses')} className="text-blue-600 font-semibold hover:underline">{t.common.backToList}</a>
          </div>
        </main>
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const courseUrl = `${baseUrl}${getDetailRoutePath(lang, 'courses', resolvedParams.slug)}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage={getRoutePath(lang, 'courses')} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Course Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {courseData.accreditation && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {lang === 'cs' ? 'Akreditováno MŠMT ČR' : lang === 'en' ? 'MŠMT Accredited' : 'Аккредитовано МШМТ'}
                </span>
              )}
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                {courseData.level}
              </span>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{courseData.duration}</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">{courseData.title}</h1>
            
            {courseData.accreditation && (
              <p className="text-sm sm:text-base text-gray-600 mb-4 italic">
                {courseData.accreditation}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-sm sm:prose-base prose-gray max-w-none mb-6 sm:mb-8">
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">{courseData.description}</p>
          </div>

          {/* Highlights */}
          {courseData.highlights && courseData.highlights.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                {lang === 'cs' ? 'Hlavní výhody' : lang === 'en' ? 'Key Highlights' : 'Основные преимущества'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {courseData.highlights.map((highlight, i) => (
                  <div key={i} className="glow-box flex items-start gap-2 p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Syllabus */}
          {courseData.syllabus && courseData.syllabus.length > 0 && (
            <ExpandableSyllabus syllabus={courseData.syllabus} lang={lang} />
          )}

          {/* Course Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Form (Hybrid) */}
            {courseData.form && (
              <div className="glow-box bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {lang === 'cs' ? 'Forma výuky' : lang === 'en' ? 'Course Format' : 'Формат курса'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{courseData.form}</p>
              </div>
            )}

            {/* Exam */}
            {courseData.exam && (
              <div className="glow-box bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {lang === 'cs' ? 'Zkouška' : lang === 'en' ? 'Examination' : 'Экзамен'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{courseData.exam}</p>
              </div>
            )}

            {/* Certification */}
            {courseData.certification && (
              <div className="glow-box bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {lang === 'cs' ? 'Certifikace' : lang === 'en' ? 'Certification' : 'Сертификация'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{courseData.certification}</p>
              </div>
            )}

            {/* Funding - Emphasized */}
            {courseData.funding && (
              <div className="glow-box bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 sm:p-5 border-2 border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-bold text-green-800">
                    {lang === 'cs' ? 'Financování' : lang === 'en' ? 'Funding' : 'Финансирование'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-green-700 leading-relaxed font-semibold">{courseData.funding}</p>
              </div>
            )}
          </div>

          {/* Back Link */}
          <a href={getRoutePath(lang, 'courses')} className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            ← {t.common.backToList}
          </a>
        </div>
      </main>
    </div>
  )
}

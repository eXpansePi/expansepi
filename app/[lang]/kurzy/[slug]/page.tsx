import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import coursesData from "@/data/courses.json"
import { getCourseSchema, getBreadcrumbSchema } from "@/lib/seo"
import ExpandableSyllabus from "./components/ExpandableSyllabus"
import AnimatedPrice from "./components/AnimatedPrice"
import ApplyButton from "./components/ApplyButton"
import { getRoutePath, getDetailRoutePath, getAllDetailRoutePaths } from "@/lib/routes"
import PyCharmPromo from "./components/PyCharmPromo"
import CourseTrustSection from "./components/CourseTrustSection"
import CourseFAQ from "./components/CourseFAQ"

interface CourseDetailProps {
  params: Promise<{ lang: string; slug: string }>
}

interface MultilingualCourseData {
  title: string
  heroHeadline?: string
  heroSubheadline?: string
  description: string
  descriptionBlocks?: { title: string; text: string; icon: string }[]
  duration: string
  level: string
  accreditation?: string
  syllabus?: string[]
  form?: string
  exam?: string
  certification?: string
  funding?: string
  highlights?: string[]
  dates?: string[]
  faq?: { question: string; answer: string }[]
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

  // Enhanced SEO description
  const seoDescription = lang === 'cs'
    ? `${courseData.description} ${courseData.funding ? courseData.funding + '.' : ''} Rekvalifikační IT kurzy plně hrazené Úřadem práce ČR.`
    : lang === 'en'
      ? `${courseData.description} ${courseData.funding ? courseData.funding + '.' : ''} IT reskilling courses fully funded by the Czech Labour Office.`
      : `${courseData.description} ${courseData.funding ? courseData.funding + '.' : ''} IT курсы переквалификации, полностью финансируемые Чешским центром занятости.`

  return {
    title: courseData.title,
    description: seoDescription,
    keywords: lang === 'cs'
      ? ['rekvalifikační IT kurzy', 'Python kurz', 'datová analýza', 'web development', 'Úřad práce', 'IT vzdělávání']
      : lang === 'en'
        ? ['IT reskilling courses', 'Python course', 'data analysis', 'web development', 'Czech Labour Office', 'IT education']
        : ['курсы переквалификации IT', 'курс Python', 'анализ данных', 'веб-разработка', 'Чешский центр занятости', 'IT образование'],
    alternates: {
      canonical: courseUrl,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`,
        'x-default': `${baseUrl}${allRoutes.cs}`
      }
    },
    openGraph: {
      title: lang === 'cs' ? `IT Kurzy eXpansePi - ${courseData.title}` : courseData.title,
      description: lang === 'cs'
        ? 'Rekvalifikační IT kurzy plně hrazené Úřadem práce ČR. Naučte se Python, datovou analýzu, web development.'
        : lang === 'en'
          ? 'IT reskilling courses fully funded by the Czech Labour Office. Learn Python, data analysis, web development.'
          : 'Курсы переквалификации IT, полностью финансируемые Чешским центром занятости. Изучите Python, анализ данных, веб-разработку.',
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
      description: seoDescription,
      images: [`${baseUrl}/og-image.jpg`],
    }
  }
}

export default async function CourseDetail({ params }: CourseDetailProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const courseData = getCourseData(resolvedParams.slug, lang)
  const rawCourse = (coursesData as any[]).find((c: any) => c.slug === resolvedParams.slug)

  if (!courseData) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation activePage={getRoutePath(lang, 'courses')} lang={lang} t={t} />
        <main className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 flex-grow">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t.common.notFound}</h1>
            <Link href={getRoutePath(lang, 'courses')} className="text-blue-600 font-semibold hover:underline">{t.common.backToList}</Link>
          </div>
        </main>
        <Footer lang={lang} />
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const courseUrl = `${baseUrl}${getDetailRoutePath(lang, 'courses', resolvedParams.slug)}`

  // Generate Course schema for structured data
  const courseSchema = getCourseSchema(
    {
      title: courseData.title,
      description: courseData.description,
      slug: resolvedParams.slug,
      level: courseData.level,
      duration: courseData.duration,
      accreditation: courseData.accreditation,
      certification: courseData.certification,
      funding: courseData.funding,
    },
    lang,
    courseUrl
  )
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t.common.home, url: `${baseUrl}/${lang}` },
    { name: t.common.courses, url: `${baseUrl}${getRoutePath(lang, 'courses')}` },
    { name: courseData.title, url: courseUrl },
  ])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navigation activePage={getRoutePath(lang, 'courses')} lang={lang} t={t} />

      <main className="flex-grow">
        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute top-16 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Breadcrumb-style back link */}
            <Link
              href={getRoutePath(lang, 'courses')}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mb-5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.common.backToList}
            </Link>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {courseData.accreditation && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {lang === 'cs' ? 'Akreditováno MŠMT ČR' : lang === 'en' ? 'MŠMT Accredited' : 'Аккредитовано МШМТ'}
                </span>
              )}
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                {courseData.level}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {courseData.duration}
              </span>
            </div>

            {/* Benefit-oriented tagline + title */}
            {courseData.heroHeadline && (
              <p className="text-sm sm:text-base text-blue-600 font-semibold mb-2 tracking-wide">
                {courseData.heroHeadline}
              </p>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              {courseData.title}
            </h1>

            {courseData.heroSubheadline && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-5">
                {courseData.heroSubheadline}
              </p>
            )}

            {/* Apply CTA in hero */}
            <div className="mt-2 flex flex-col items-start gap-2">
              <ApplyButton courseTitle={courseData.title} lang={lang} variant="hero" />
              <span className="text-xs sm:text-sm text-gray-400">
                {lang === 'cs' ? 'Nezávaznĕ • Nic neplatíte • Ozveme se do 24 hodin' : lang === 'en' ? 'No commitment • Free • We\'ll reply within 24 hours' : 'Без обязательств • Бесплатно • Ответим в течение 24 часов'}
              </span>
            </div>
          </div>
        </section>

        {/* ── Price & Dates Card ─────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 -mt-4 relative z-10 mb-8 sm:mb-10">
          <div className="max-w-5xl mx-auto">
            <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400" />
              <div className="p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">

                  {/* Left side: Additional Info and Dates */}
                  <div className="flex flex-col gap-4 w-full sm:w-auto order-2 sm:order-1 mt-2 sm:mt-0">
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base text-gray-700">
                        {courseData.funding ? t.courses.priceNote : t.courses.priceNote}
                      </p>
                      {t.courses.installments && (
                        <p className="text-sm sm:text-base text-blue-600 font-bold">{t.courses.installments}</p>
                      )}
                    </div>

                    {/* Upcoming Dates / Cycles */}
                    {courseData.dates && courseData.dates.length > 0 && (
                      <div className="pt-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {lang === 'cs' ? 'Nejbližší termíny' : lang === 'en' ? 'Upcoming Dates' : 'Ближайшие даты'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {courseData.dates.map((date, index) => (
                            <span key={index} className="inline-flex items-center gap-1.5 bg-blue-50/60 text-blue-700 border border-blue-100 rounded-xl px-3 py-1.5 text-sm font-semibold">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {date}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side: Prices and Funding badge */}
                  <div className="flex flex-col items-start sm:items-end gap-3 order-1 sm:order-2 sm:ml-auto w-full sm:w-auto">
                    <div className="flex items-baseline gap-3">
                      <AnimatedPrice
                        originalPrice={t.courses.price}
                        newPrice={t.courses.priceFrom}
                      />
                    </div>
                    {courseData.funding && (
                      <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 sm:py-2.5 flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-base sm:text-lg font-bold text-green-700 whitespace-nowrap">{courseData.funding}</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── PyCharm Promo (Python only) ────────────────────────────────── */}
        {resolvedParams.slug === 'programator-www-aplikaci-v-pythonu' && (
          <section className="px-4 sm:px-6 relative z-10 mb-8 sm:mb-10">
            <div className="max-w-5xl mx-auto">
              <PyCharmPromo lang={lang} />
            </div>
          </section>
        )}

        {/* ── Description ─────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 mb-8 sm:mb-10">
          <div className="max-w-5xl mx-auto">
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">{courseData.description}</p>

            {courseData.descriptionBlocks && courseData.descriptionBlocks.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
                {courseData.descriptionBlocks.map((block, i) => (
                  <div key={i} className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className={`h-1 ${i === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : i === 1 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-violet-500 to-purple-400'}`} />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-amber-100' : i === 1 ? 'bg-green-100' : 'bg-violet-100'}`}>
                          {block.icon === 'python' ? (
                            <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                          ) : block.icon === 'django' ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                          ) : (
                            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-gray-900">{block.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{block.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Highlights ──────────────────────────────────────────────── */}
        {courseData.highlights && courseData.highlights.length > 0 && (
          <section className="px-4 sm:px-6 mb-8 sm:mb-10">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                {lang === 'cs' ? 'Proč tento kurz změní váš život' : lang === 'en' ? 'Why this course will change your life' : 'Почему этот курс изменит вашу жизнь'}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {courseData.highlights.map((highlight, i) => (
                  <div key={i} className="glow-box flex items-start gap-3 p-4 sm:p-5 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Expandable Syllabus ─────────────────────────────────────── */}
        {courseData.syllabus && courseData.syllabus.length > 0 && (
          <section className="px-4 sm:px-6 mb-8 sm:mb-10">
            <div className="max-w-5xl mx-auto">
              <ExpandableSyllabus syllabus={courseData.syllabus} lang={lang} />
            </div>
          </section>
        )}

        {/* ── Trust & Lecturers Section ──────────────────────────────── */}
        <CourseTrustSection 
          lang={lang} 
          lecturerIds={resolvedParams.slug === 'programator-www-aplikaci-v-pythonu' ? ["example-founder", "5"] : ["5"]} 
        />

        {/* ── FAQ Section ─────────────────────────────────────────── */}
        {courseData.faq && courseData.faq.length > 0 && (
          <CourseFAQ faq={courseData.faq} lang={lang} />
        )}

        {/* ── Course Details Grid ─────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-14 sm:pb-18">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Form (Hybrid) */}
              {courseData.form && (
                <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-1 bg-gradient-to-r from-blue-600 to-sky-400" />
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {lang === 'cs' ? 'Forma výuky' : lang === 'en' ? 'Course Format' : 'Формат курса'}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{courseData.form}</p>
                  </div>
                </article>
              )}

              {/* Exam */}
              {courseData.exam && (
                <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-400" />
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4.5 h-4.5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {lang === 'cs' ? 'Zkouška' : lang === 'en' ? 'Examination' : 'Экзамен'}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{courseData.exam}</p>
                  </div>
                </article>
              )}

              {/* Certification */}
              {courseData.certification && (
                <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4.5 h-4.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {lang === 'cs' ? 'Certifikace' : lang === 'en' ? 'Certification' : 'Сертификация'}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{courseData.certification}</p>
                  </div>
                </article>
              )}

              {/* Funding - Emphasized */}
              {courseData.funding && (
                <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {lang === 'cs' ? 'Financování' : lang === 'en' ? 'Funding' : 'Финансирование'}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-emerald-700 leading-relaxed font-semibold">{courseData.funding}</p>
                  </div>
                </article>
              )}
            </div>

            {/* Bottom actions */}
            <div className="mt-8 sm:mt-10 flex flex-col items-start gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <ApplyButton courseTitle={courseData.title} lang={lang} variant="bottom" />
                <Link
                  href={getRoutePath(lang, 'courses')}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t.common.backToList}
                </Link>
              </div>
              <span className="text-xs sm:text-sm text-gray-400">
                {lang === 'cs' ? 'Nezávazné • Nic neplatíte • Ozveme se do 24 hodin' : lang === 'en' ? 'No commitment • Free • We\'ll reply within 24 hours' : 'Без обязательств • Бесплатно • Ответим в течение 24 часов'}
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}

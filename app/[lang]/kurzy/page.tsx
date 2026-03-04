import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getActiveCourses, getUpcomingCourses } from "@/data/courses"
import { getRoutePath, getAllRoutePaths, getDetailRoutePath } from "@/lib/routes"

interface CoursesPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: CoursesPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const coursesUrl = `${baseUrl}${getRoutePath(lang, 'courses')}`
  const allRoutes = getAllRoutePaths('courses')

  const seoDescription = lang === 'cs'
    ? 'IT kurzy plně hrazené Úřadem práce ČR. Rekvalifikační IT kurzy - Python, Java, C#, JavaScript, PHP. Naučte se programovat s experty z Matfyzu UK a ČVUT.'
    : lang === 'en'
      ? 'IT courses fully funded by the Czech Labour Office. IT reskilling courses - Python, Java, C#, JavaScript, PHP. Learn programming with experts from Charles University and Czech Technical University.'
      : 'IT курсы, полностью финансируемые Чешским центром занятости. Курсы переквалификации IT - Python, Java, C#, JavaScript, PHP.'

  return {
    title: lang === 'cs' ? 'IT Kurzy eXpansePi - Rekvalifikační kurzy plně hrazené Úřadem práce' : t.courses.title,
    description: seoDescription,
    keywords: lang === 'cs'
      ? ['rekvalifikační IT kurzy', 'Python kurz', 'Java kurz', 'C# kurz', 'JavaScript kurz', 'PHP kurz', 'Úřad práce', 'IT vzdělávání']
      : lang === 'en'
        ? ['IT reskilling courses', 'Python course', 'Java course', 'C# course', 'JavaScript course', 'PHP course', 'Czech Labour Office']
        : ['курсы переквалификации IT', 'курс Python', 'курс Java', 'курс C#', 'курс JavaScript', 'курс PHP'],
    alternates: {
      canonical: coursesUrl,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`,
        'x-default': `${baseUrl}${allRoutes.cs}`
      }
    },
    openGraph: {
      title: lang === 'cs' ? 'IT Kurzy eXpansePi' : t.courses.title,
      description: seoDescription,
      url: coursesUrl,
      siteName: 'eXpansePi',
      locale: lang === 'cs' ? 'cs_CZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      type: 'website',
      images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: t.courses.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title: lang === 'cs' ? 'IT Kurzy eXpansePi' : t.courses.title,
      description: seoDescription,
      images: [`${baseUrl}/og-image.jpg`],
    }
  }
}

// ─── Language color accents for upcoming course cards ─────────────────────────

const LANG_COLORS: Record<string, { accent: string; iconBg: string; iconText: string }> = {
  'programator-csharp': { accent: 'from-purple-500 to-violet-500', iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
  'programator-java': { accent: 'from-orange-500 to-amber-500', iconBg: 'bg-orange-100', iconText: 'text-orange-600' },
  'programator-php': { accent: 'from-indigo-500 to-blue-500', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600' },
  'programator-javascript': { accent: 'from-yellow-500 to-amber-400', iconBg: 'bg-yellow-100', iconText: 'text-yellow-600' },
  'datova-analyza': { accent: 'from-teal-500 to-cyan-500', iconBg: 'bg-teal-100', iconText: 'text-teal-600' },
  'web-development': { accent: 'from-emerald-500 to-green-500', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
}

const DEFAULT_COLOR = { accent: 'from-gray-400 to-gray-500', iconBg: 'bg-gray-100', iconText: 'text-gray-600' }

// ─── Language icons (simple SVG code brackets per language) ───────────────────

function LangIcon({ slug }: { slug: string }) {
  const color = LANG_COLORS[slug] || DEFAULT_COLOR
  return (
    <div className={`w-10 h-10 rounded-lg ${color.iconBg} flex items-center justify-center flex-shrink-0`}>
      <svg className={`w-5 h-5 ${color.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CoursesPage({ params }: CoursesPageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)

  const activeCourses = getActiveCourses(lang)
  const upcomingCourses = getUpcomingCourses(lang)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation activePage={getRoutePath(lang, 'courses')} lang={lang} t={t} />

      <main className="flex-grow">
        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute top-16 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium mb-5">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {lang === 'cs' ? 'Nabíráme do nového běhu' : lang === 'en' ? 'Enrolling for new cohort' : 'Набор в новый поток'}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              {t.courses.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
              {t.courses.subtitle}
            </p>
          </div>
        </section>

        {/* ── Active / Featured Courses ──────────────────────────────────── */}
        {activeCourses.length > 0 && (
          <section aria-labelledby="available-heading" className="px-4 sm:px-6 pb-14 sm:pb-18">
            <div className="max-w-5xl mx-auto">
              <h2 id="available-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                {t.courses.available}
              </h2>

              {activeCourses.map(course => (
                <article
                  key={course.slug}
                  className="glow-box relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Top accent gradient */}
                  <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400" />

                  <div className="p-5 sm:p-8">
                    {/* Badges row */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.accreditation && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {lang === 'cs' ? 'Akreditováno MŠMT' : lang === 'en' ? 'MŠMT Accredited' : 'Аккредитовано МШМТ'}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                        {course.level}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.duration}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{course.title}</h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6">
                      {course.description}
                    </p>

                    {/* Info cards row */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {/* Dates */}
                      {course.dates && course.dates.length > 0 && (
                        <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {lang === 'cs' ? 'Nejbližší termíny' : lang === 'en' ? 'Upcoming dates' : 'Ближайшие даты'}
                          </h4>
                          <div className="space-y-1">
                            {course.dates.map((date, idx) => (
                              <p key={idx} className="text-sm font-semibold text-blue-700">{date}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pricing */}
                      <div className="bg-green-50/60 rounded-xl p-4 border border-green-100">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {lang === 'cs' ? 'Cena kurzu' : lang === 'en' ? 'Course price' : 'Стоимость курса'}
                        </h4>
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-3xl sm:text-4xl font-black text-green-600 tracking-tight">{t.courses.priceFrom}</span>
                          <span className="text-lg text-gray-400 font-bold line-through decoration-red-400 decoration-2">{t.courses.price}</span>
                        </div>
                        {course.funding && (
                          <p className="text-sm font-semibold text-green-700 mt-1.5 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {course.funding}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={getDetailRoutePath(lang, 'courses', course.slug)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-sm sm:text-base"
                    >
                      {lang === 'cs' ? 'Více informací' : lang === 'en' ? 'More information' : 'Подробнее'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Upcoming / Preparing Courses Grid ──────────────────────────── */}
        {upcomingCourses.length > 0 && (
          <section aria-labelledby="preparing-heading" className="px-4 sm:px-6 pb-16 sm:pb-20">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h2 id="preparing-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {t.courses.preparing}
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  {lang === 'cs'
                    ? 'Tyto kurzy aktuálně připravujeme. Brzy budou k dispozici.'
                    : lang === 'en'
                      ? 'These courses are currently being prepared. They will be available soon.'
                      : 'Эти курсы в настоящее время готовятся. Скоро они будут доступны.'}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {upcomingCourses.map((course) => {
                  const color = LANG_COLORS[course.slug] || DEFAULT_COLOR
                  return (
                    <article
                      key={course.slug}
                      className="glow-box group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {/* Accent bar */}
                      <div className={`h-1 bg-gradient-to-r ${color.accent} opacity-80 group-hover:opacity-100 transition-opacity`} />

                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                          <LangIcon slug={course.slug} />
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {course.title}
                            </h3>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] font-medium">
                              {t.courses.preparing}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{course.level}</span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  )
}

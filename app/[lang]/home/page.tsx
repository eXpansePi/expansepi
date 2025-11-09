import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "../components/Navigation"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getActiveCourses } from "@/data/courses"

interface HomePageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const homeUrl = `${baseUrl}/${lang}/home`
  
  return {
    title: t.home.title,
    description: t.home.heroDescription,
    alternates: {
      canonical: homeUrl,
      languages: {
        'cs': `${baseUrl}/cs/home`,
        'en': `${baseUrl}/en/home`,
        'ru': `${baseUrl}/ru/home`
      }
    },
    openGraph: {
      title: t.home.title,
      description: t.home.heroDescription,
      url: homeUrl,
      siteName: 'eXpansePi',
      locale: lang === 'cs' ? 'cs_CZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      type: 'website',
    },
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const courses = getActiveCourses(lang).slice(0, 3)

  const benefits = [
    {
      icon: "🎓",
      title: t.home.benefits.experienced.title,
      description: t.home.benefits.experienced.description,
    },
    {
      icon: "💼",
      title: t.home.benefits.practical.title,
      description: t.home.benefits.practical.description,
    },
    {
      icon: "📜",
      title: t.home.benefits.certification.title,
      description: t.home.benefits.certification.description,
    },
    {
      icon: "👥",
      title: t.home.benefits.individual.title,
      description: t.home.benefits.individual.description,
    },
  ]

  const stats = [
    { number: "500+", label: t.home.stats.graduates },
    { number: "95%", label: t.home.stats.success },
    { number: "50+", label: t.home.stats.lecturers },
    { number: "20+", label: t.home.stats.courses },
  ]

  // Map course levels to translations
  const getLevelTranslation = (level: string) => {
    const levelLower = level.toLowerCase()
    if (levelLower.includes('začátečník') || levelLower.includes('beginner') || levelLower.includes('начинающ')) {
      return t.home.courseLevels.beginner
    }
    if (levelLower.includes('středně') || levelLower.includes('intermediate') || levelLower.includes('средн')) {
      return t.home.courseLevels.intermediate
    }
    if (levelLower.includes('pokročil') || levelLower.includes('advanced') || levelLower.includes('продвинут')) {
      return t.home.courseLevels.advanced
    }
    return level
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage={`/${lang}/home`} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t.home.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t.home.heroDescription}
            </p>
          </div>

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="glow-box bg-gradient-to-br from-blue-50 to-sky-50 p-3 sm:p-4 rounded-lg"
              >
                <div className="text-2xl sm:text-3xl mb-2">{b.icon}</div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{b.title}</h2>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>

          {/* Courses */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">{t.home.ourCourses}</h2>
            {courses.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
                  {courses.map((c, i) => (
                    <div key={i} className="glow-box bg-white rounded-xl shadow-lg p-4 sm:p-5 hover:shadow-xl transition-all duration-300 flex flex-col">
                      {/* Course Image */}
                      {c.image && (
                        <div className="mb-3 flex items-center justify-center h-16 sm:h-20 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg">
                          <img 
                            src={c.image} 
                            alt={c.title}
                            className="h-12 sm:h-16 w-auto object-contain"
                          />
                        </div>
                      )}
                      
                      {/* Accreditation Badge */}
                      {c.accreditation && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {lang === 'cs' ? 'Akreditováno MŠMT' : lang === 'en' ? 'MŠMT Accredited' : 'Аккредитовано МШМТ'}
                          </span>
                        </div>
                      )}
                      
                      {/* Level Badge */}
                      <div className="mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {getLevelTranslation(c.level)}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{c.title}</h3>
                      
                      {/* Duration */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{c.duration}</span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">{c.description}</p>
                      
                      {/* CTA Button */}
                      <Link
                        href={`/${lang}/kurzy/${c.slug}`}
                        className="mt-auto block text-center px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-sky-400 text-white rounded-lg hover:from-blue-700 hover:to-sky-500 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {t.common.moreInfo}
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Link
                    href={`/${lang}/kurzy`}
                    className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-sky-400 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t.home.viewAll}
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-6">{t.courses.preparing}</p>
                <Link
                  href={`/${lang}/kurzy`}
                  className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-sky-400 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  {t.home.viewAll}
                </Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-sky-400 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-8 sm:mb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{s.number}</div>
                  <div className="text-blue-100 text-xs font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{t.home.readyToStart}</h2>
            <div className="flex gap-2 sm:gap-3 justify-center flex-col sm:flex-row">
              <Link
                href={`/${lang}/kontakt`}
                className="px-5 sm:px-6 py-2 text-sm bg-gradient-to-r from-blue-600 to-sky-400 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                {t.home.contact}
              </Link>
              <Link
                href={`/${lang}/kurzy`}
                className="px-5 sm:px-6 py-2 text-sm bg-white text-blue-600 rounded-lg border-2 border-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                {t.home.courses}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


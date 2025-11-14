import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getActiveCourses, getUpcomingCourses } from "@/data/courses"
import { CourseCard } from "./components"
import { getRoutePath, getAllRoutePaths, type RouteKey } from "@/lib/routes"

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
  
  // Enhanced SEO description
  const seoDescription = lang === 'cs' 
    ? 'IT kurzy plně hrazené Úřadem práce ČR. Rekvalifikační IT kurzy - Python, datová analýza, web development. Naučte se programovat s experty z Matfyzu UK a ČVUT.'
    : lang === 'en'
    ? 'IT courses fully funded by the Czech Labour Office. IT reskilling courses - Python, data analysis, web development. Learn programming with experts from Charles University and Czech Technical University.'
    : 'IT курсы, полностью финансируемые Чешским центром занятости. Курсы переквалификации IT - Python, анализ данных, веб-разработка. Изучите программирование с экспертами из Карлова университета и Чешского технического университета.'

  return {
    title: lang === 'cs' ? 'IT Kurzy eXpansePi - Rekvalifikační kurzy plně hrazené Úřadem práce' : t.courses.title,
    description: seoDescription,
    keywords: lang === 'cs'
      ? ['rekvalifikační IT kurzy', 'Python kurz', 'datová analýza', 'web development', 'Úřad práce', 'IT vzdělávání', 'rekvalifikace IT']
      : lang === 'en'
      ? ['IT reskilling courses', 'Python course', 'data analysis', 'web development', 'Czech Labour Office', 'IT education']
      : ['курсы переквалификации IT', 'курс Python', 'анализ данных', 'веб-разработка', 'Чешский центр занятости', 'IT образование'],
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
      description: lang === 'cs' 
        ? 'Rekvalifikační IT kurzy plně hrazené Úřadem práce ČR. Naučte se Python, datovou analýzu, web development.'
        : lang === 'en'
        ? 'IT reskilling courses fully funded by the Czech Labour Office. Learn Python, data analysis, web development.'
        : 'Курсы переквалификации IT, полностью финансируемые Чешским центром занятости. Изучите Python, анализ данных, веб-разработку.',
      url: coursesUrl,
      siteName: 'eXpansePi',
      locale: lang === 'cs' ? 'cs_CZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: lang === 'cs' ? 'IT Kurzy eXpansePi' : t.courses.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: lang === 'cs' ? 'IT Kurzy eXpansePi' : t.courses.title,
      description: seoDescription,
      images: [`${baseUrl}/og-image.jpg`],
    }
  }
}

export default async function CoursesPage({ params }: CoursesPageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)

  const activeCourses = getActiveCourses(lang)
  const upcomingCourses = getUpcomingCourses(lang)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navigation activePage={getRoutePath(lang, 'courses')} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">{t.courses.title}</h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t.courses.title}</p>

          {activeCourses.length > 0 && (
            <section aria-labelledby="available-heading" className="mb-8 sm:mb-10">
              <h2 id="available-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">{t.courses.available}</h2>
              <div className="space-y-4 sm:space-y-5">
                {activeCourses.map(course => (
                  <CourseCard key={course.slug} course={course} lang={lang} />
                ))}
              </div>
            </section>
          )}

          {upcomingCourses.length > 0 && (
            <section aria-labelledby="preparing-heading">
              <h2 id="preparing-heading" className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">{t.courses.preparing}</h2>
              <div className="space-y-4 sm:space-y-5">
                {upcomingCourses.map(course => (
                  <CourseCard key={course.slug} course={course} lang={lang} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </div>
  )
}

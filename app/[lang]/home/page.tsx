import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"
import SalaryStats from "./components/SalaryStats"
import SalaryCard from "./components/SalaryCard"

interface HomePageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const homeUrl = `${baseUrl}${getRoutePath(lang, 'home')}`
  const allRoutes = getAllRoutePaths('home')
  
  const seoDescription = lang === 'cs'
    ? 'IT kurzy plně hrazené Úřadem práce ČR. Rekvalifikační IT kurzy - Python, datová analýza, web development. Naučte se programovat s experty z Matfyzu UK a ČVUT.'
    : lang === 'en'
    ? 'IT courses fully funded by the Czech Labour Office. IT reskilling courses - Python, data analysis, web development. Learn programming with experts from Charles University and Czech Technical University.'
    : 'IT курсы, полностью финансируемые Чешским центром занятости. Курсы переквалификации IT - Python, анализ данных, веб-разработка. Изучите программирование с экспертами из Карлова университета и Чешского технического университета.'

  return {
    title: lang === 'cs' ? 'IT Kurzy eXpansePi - Rekvalifikační kurzy plně hrazené Úřadem práce' : t.home.title,
    description: seoDescription,
    keywords: lang === 'cs'
      ? ['rekvalifikační IT kurzy', 'Python kurz', 'datová analýza', 'web development', 'Úřad práce', 'IT vzdělávání']
      : lang === 'en'
      ? ['IT reskilling courses', 'Python course', 'data analysis', 'web development', 'Czech Labour Office', 'IT education']
      : ['курсы переквалификации IT', 'курс Python', 'анализ данных', 'веб-разработка', 'Чешский центр занятости', 'IT образование'],
    alternates: {
      canonical: homeUrl,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`,
        'x-default': `${baseUrl}${allRoutes.cs}`
      }
    },
    openGraph: {
      title: lang === 'cs' ? 'IT Kurzy eXpansePi' : t.home.title,
      description: lang === 'cs'
        ? 'Rekvalifikační IT kurzy plně hrazené Úřadem práce ČR. Naučte se Python, datovou analýzu, web development.'
        : seoDescription,
      url: homeUrl,
      siteName: 'eXpansePi',
      locale: lang === 'cs' ? 'cs_CZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: lang === 'cs' ? 'IT Kurzy eXpansePi' : t.home.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: lang === 'cs' ? 'IT Kurzy eXpansePi' : t.home.title,
      description: seoDescription,
      images: [`${baseUrl}/og-image.jpg`],
    }
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)

  const benefits = [
    {
      icon: "🇪🇺",
      title: t.home.benefits.european.title,
      description: t.home.benefits.european.description,
    },
    {
      icon: "🐍",
      title: t.home.benefits.language.title,
      description: t.home.benefits.language.description,
    },
    {
      icon: "🏰",
      title: t.home.benefits.prague.title,
      description: t.home.benefits.prague.description,
    },
    {
      icon: "🏠",
      title: t.home.benefits.freedom.title,
      description: t.home.benefits.freedom.description,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navigation activePage={getRoutePath(lang, 'home')} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 flex-grow">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t.home.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t.home.heroDescription}
            </p>
          </div>

          {/* Salary Cards */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12">
            <SalaryCard
              lang={lang}
              icon="🔧"
              level="junior"
              salary={70000}
              gradient="from-blue-500 to-sky-400"
            />
            <SalaryCard
              lang={lang}
              icon="⚙️"
              level="midlevel"
              salary={110000}
              gradient="from-blue-500 to-sky-400"
            />
            <SalaryCard
              lang={lang}
              icon="🚀"
              level="senior"
              salary={180000}
              gradient="from-blue-500 to-sky-400"
            />
          </div>

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-12">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="glow-box bg-gradient-to-br from-blue-50 to-sky-50 p-5 sm:p-6 lg:p-7 rounded-lg"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-center">{b.icon}</div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">{b.title}</h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center">{b.description}</p>
              </div>
            ))}
          </div>

          {/* Salary Stats */}
          <div className="glow-box bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-8 sm:mb-12 shadow-lg">
            <SalaryStats lang={lang} />
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{t.home.readyToStart}</h2>
            <div className="flex gap-2 sm:gap-3 justify-center flex-col sm:flex-row">
              <Link
                href={getRoutePath(lang, 'contact')}
                className="px-5 sm:px-6 py-2 text-sm bg-gradient-to-r from-blue-600 to-sky-400 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                {t.home.contact}
              </Link>
              <Link
                href={getRoutePath(lang, 'courses')}
                className="px-5 sm:px-6 py-2 text-sm bg-white text-blue-600 rounded-lg border-2 border-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                {t.home.courses}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  )
}


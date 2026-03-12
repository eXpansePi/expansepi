import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"
import SalaryStats from "./components/SalaryStats"
import SalaryShowcase from "./components/SalaryShowcase"

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

  const BENEFIT_PALETTES = [
    { bar: "from-blue-500 via-cyan-400 to-teal-400", bg: "from-blue-50/60 to-cyan-50/40", iconBg: "bg-blue-100", titleColor: "text-blue-700" },
    { bar: "from-violet-500 via-fuchsia-400 to-pink-400", bg: "from-violet-50/60 to-fuchsia-50/40", iconBg: "bg-violet-100", titleColor: "text-violet-700" },
    { bar: "from-emerald-500 via-teal-400 to-cyan-400", bg: "from-emerald-50/60 to-teal-50/40", iconBg: "bg-emerald-100", titleColor: "text-emerald-700" },
    { bar: "from-amber-500 via-orange-400 to-yellow-400", bg: "from-amber-50/60 to-orange-50/40", iconBg: "bg-amber-100", titleColor: "text-amber-700" },
  ] as const

  // SVG icons for benefits
  const benefitIcons = [
    // Globe - EU qualification
    (color: string) => <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    // Code - Programming language
    (color: string) => <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    // Map pin - Prague location
    (color: string) => <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    // Laptop - Remote work / freedom
    (color: string) => <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="20" x2="22" y2="20" /><line x1="12" y1="17" x2="12" y2="20" /></svg>,
  ]

  const iconColors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"]

  const benefits = [
    {
      title: t.home.benefits.european.title,
      description: t.home.benefits.european.description,
    },
    {
      title: t.home.benefits.language.title,
      description: t.home.benefits.language.description,
    },
    {
      title: t.home.benefits.prague.title,
      description: t.home.benefits.prague.description,
    },
    {
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

          {/* F1 Analogy Section */}
          <div className="glow-box bg-white rounded-xl shadow-lg overflow-hidden mb-8 sm:mb-12">
            {/* Gradient accent bar — matches page palette */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-teal-400" />
            <div className="px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-14 bg-gradient-to-br from-blue-50/50 via-white to-sky-50/40">
              {/* Badge */}
              <div className="flex justify-center mb-5 sm:mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs sm:text-sm font-medium text-blue-600 tracking-wide uppercase">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  {t.home.f1Analogy.badge}
                </span>
              </div>

              {/* Main headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 leading-tight mb-4 sm:mb-5 max-w-2xl md:max-w-4xl mx-auto text-balance">
                {t.home.f1Analogy.headline}
              </h2>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
                <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-blue-400/60 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400/80" />
                <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-blue-400/60 rounded-full" />
              </div>

              {/* Subtext */}
              <p className="text-xl sm:text-2xl text-gray-600 text-center max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto leading-relaxed text-pretty">
                {t.home.f1Analogy.subtext}
              </p>
            </div>
          </div>

          {/* Salary Showcase */}
          <SalaryShowcase lang={lang} />

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-12">
            {benefits.map((b, i) => {
              const palette = BENEFIT_PALETTES[i % BENEFIT_PALETTES.length]
              return (
                <div
                  key={i}
                  className="glow-box bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Gradient accent bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${palette.bar}`} />
                  <div className={`flex-1 flex flex-col p-5 sm:p-6 lg:p-7 bg-gradient-to-br ${palette.bg}`}>
                    <div className={`w-14 h-14 ${palette.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                      {benefitIcons[i](iconColors[i])}
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">{b.title}</h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center">{b.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Salary Stats */}
          <div className="glow-box bg-white rounded-xl overflow-hidden shadow-lg mb-8 sm:mb-12">
            {/* Gradient accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-violet-400 to-emerald-400" />
            <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50/50 via-white to-sky-50/40">
              <SalaryStats lang={lang} />
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{t.home.readyToStart}</h2>
            <div className="flex gap-2 sm:gap-3 justify-center flex-col sm:flex-row">
              <Link
                href={getRoutePath(lang, 'contact')}
                className="px-6 sm:px-8 py-2.5 text-sm bg-gradient-to-r from-blue-600 via-sky-500 to-teal-400 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {t.home.contact}
              </Link>
              <Link
                href={getRoutePath(lang, 'courses')}
                className="px-6 sm:px-8 py-2.5 text-sm bg-white text-blue-600 rounded-lg border-2 border-blue-200 font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
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


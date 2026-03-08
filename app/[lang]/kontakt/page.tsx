import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import ContactForm from "./ContactForm"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"

interface ContactPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const contactUrl = `${baseUrl}${getRoutePath(lang, 'contact')}`
  const allRoutes = getAllRoutePaths('contact')

  return {
    title: t.contact.title,
    description: t.contact.description,
    alternates: {
      canonical: contactUrl,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`,
        'x-default': `${baseUrl}${allRoutes.cs}`
      }
    },
    openGraph: {
      title: t.contact.title,
      description: t.contact.description,
      url: contactUrl,
      siteName: 'eXpansePi',
      locale: lang === 'cs' ? 'cs_CZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      type: 'website',
    },
  }
}

export default async function ContactPage({ params }: ContactPageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation activePage={getRoutePath(lang, 'contact')} lang={lang} t={t} />

      <main className="flex-grow">
        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute top-16 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium mb-5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {lang === 'cs' ? 'Ozvěte se nám' : lang === 'en' ? 'Get in touch' : 'Свяжитесь с нами'}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              {t.contact.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
              {t.contact.description}
            </p>
          </div>
        </section>

        {/* ── Contact Cards + Form ──────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto">
            {/* Quick Contact Cards Row */}
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10 -mt-6 relative z-10">
              {/* Email Card */}
              <a href="mailto:info@expansepi.com" className="glow-box group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <div className="h-1 bg-gradient-to-r from-blue-600 to-sky-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.contact.email}</h3>
                      <p className="text-sm sm:text-base font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">info@expansepi.com</p>
                    </div>
                  </div>
                </div>
              </a>

              {/* Phone Card */}
              <a href="tel:+420775715700" className="glow-box group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.contact.phone}</h3>
                      <p className="text-sm sm:text-base font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">+420 775 715 700</p>
                    </div>
                  </div>
                </div>
              </a>

              {/* Address Card */}
              <div className="glow-box group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.contact.address}</h3>
                      <p className="text-sm sm:text-base font-semibold text-gray-700">{t.contact.addressValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content: Info + Form */}
            <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
              {/* Contact Information Detail Card */}
              <div className="lg:col-span-2">
                <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                  <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400" />
                  <div className="p-5 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                      {t.contact.contactInfo}
                    </h2>

                    <div className="space-y-5">
                      {/* Email */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.contact.email}</p>
                          <a href="mailto:info@expansepi.com" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors">
                            info@expansepi.com
                          </a>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.contact.phone}</p>
                          <a href="tel:+420775715700" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors">
                            +420 775 715 700
                          </a>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.contact.address}</p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">{t.contact.addressValue}</p>
                        </div>
                      </div>

                      {/* Teaching Location */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.contact.teachingLocation}</p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">{t.contact.teachingLocationValue}</p>
                        </div>
                      </div>

                      {/* Divider */}
                      <hr className="border-gray-100 my-2" />

                      {/* IČO */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.contact.ico}</p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">{t.contact.icoValue}</p>
                        </div>
                      </div>

                      {/* Bank Account */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.contact.bankAccount}</p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">{t.contact.bankAccountValue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3">
                <ContactForm lang={lang} t={t} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}

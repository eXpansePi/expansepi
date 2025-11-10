import type { Metadata } from "next"
import Navigation from "../components/Navigation"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage={getRoutePath(lang, 'contact')} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t.contact.title}</h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t.contact.description}</p>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="glow-box bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t.contact.contactInfo}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 font-semibold mb-1 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {t.contact.email}
                    </p>
                    <a href="mailto:contact@expansepi.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                      contact@expansepi.com
                    </a>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold mb-1 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {t.contact.phone}
                    </p>
                    <a href="tel:+420775715700" className="text-blue-600 hover:text-blue-700 transition-colors">
                      +420 775 715 700
                    </a>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold mb-1 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t.contact.address}
                    </p>
                    <p className="text-gray-700">
                      {t.contact.addressValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm lang={lang} t={t} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

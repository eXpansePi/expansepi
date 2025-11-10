import type { Metadata } from "next"
import { languages, isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getOrganizationSchema } from "@/lib/seo"

const langMetadata: Record<Language, { title: string; description: string; locale: string }> = {
  cs: {
    title: "eXpansePi - Rekvalifikační IT kurzy | Python, Datová analýza, Web Development",
    description: "Rekvalifikační IT kurzy s experty z Matfyzu UK a ČVUT. Naučte se Python, datovou analýzu, web development. Budujeme novou generaci IT specialistů.",
    locale: "cs_CZ"
  },
  en: {
    title: "eXpansePi - IT Reskilling Courses | Python, Data Analysis, Web Development",
    description: "IT reskilling courses with experts from Charles University and Czech Technical University. Learn Python, data analysis, web development. Building the next generation of IT specialists.",
    locale: "en_US"
  },
  ru: {
    title: "eXpansePi - Курсы переквалификации IT | Python, анализ данных, веб-разработка",
    description: "Курсы переквалификации IT с экспертами из Карлова университета и Чешского технического университета. Изучите Python, анализ данных, веб-разработку. Создаем новое поколение IT специалистов.",
    locale: "ru_RU"
  }
}

export function generateStaticParams() {
  return languages.map(lang => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const meta = langMetadata[lang]

  return {
    title: {
      default: meta.title,
      template: "%s | eXpansePi"
    },
    description: meta.description,
    authors: [{ name: "eXpansePi" }],
    creator: "eXpansePi",
    publisher: "eXpansePi",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-icon.svg', type: 'image/svg+xml', sizes: '180x180' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/icon.svg',
    },
    alternates: {
      canonical: `https://expansepi.com/${lang}`,
      languages: {
        'cs': 'https://expansepi.com/cs',
        'en': 'https://expansepi.com/en',
        'ru': 'https://expansepi.com/ru',
        'x-default': 'https://expansepi.com/cs'
      }
    },
    openGraph: {
      type: "website",
      locale: meta.locale,
      url: `https://expansepi.com/${lang}`,
      siteName: "eXpansePi",
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: `https://expansepi.com/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "eXpansePi - IT Education",
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: "@expansepi",
      images: ["https://expansepi.com/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage

  const organizationSchema = getOrganizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  )
}

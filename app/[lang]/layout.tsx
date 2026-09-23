import type { Metadata } from "next"
import { languages, isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getOrganizationSchema } from "@/lib/seo"
import { JsonLd } from "@/app/components/JsonLd"
import { CookieBanner } from "./components/CookieBanner"

const langMetadata: Record<Language, { title: string; description: string; locale: string }> = {
  cs: {
    title: "eXpansePi - Praktické IT a rekvalifikační kurzy",
    description: "Vyberte si svůj směr v IT. Praktické kurzy s vývojáři z oboru, přehledným obsahem a jasnými podmínkami. Nabídku postupně rozšiřujeme.",
    locale: "cs_CZ"
  },
  en: {
    title: "eXpansePi - Practical IT and Reskilling Courses",
    description: "Find your direction in IT. Practical courses with practising developers, clear curricula and transparent conditions. Our catalog is growing.",
    locale: "en_US"
  },
  ru: {
    title: "eXpansePi - Практические IT-курсы и переподготовка",
    description: "Найдите своё направление в IT. Практические курсы с разработчиками, понятными программами и прозрачными условиями. Каталог постепенно расширяется.",
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'

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
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-icon.svg', type: 'image/svg+xml', sizes: '180x180' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/favicon.ico',
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'cs': `${baseUrl}/cs`,
        'en': `${baseUrl}/en`,
        'ru': `${baseUrl}/ru`,
        'x-default': `${baseUrl}/cs`
      }
    },
    openGraph: {
      type: "website",
      locale: meta.locale,
      url: `${baseUrl}/${lang}`,
      siteName: "eXpansePi",
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
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
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: '/manifest.webmanifest',
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
      {/*
        Next.js App Router cannot set html[lang] from a nested layout.
        This inline script runs synchronously before hydration so the correct
        lang is applied on first paint (before LangSetter's useEffect fires).
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = ${JSON.stringify(lang)};`,
        }}
      />
      <JsonLd data={organizationSchema} />
      {children}
      <CookieBanner lang={lang} />
    </>
  )
}

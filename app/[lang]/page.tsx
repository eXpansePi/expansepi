import type { Metadata } from "next"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"
import HomeClient from "./HomeClient"

interface HomePageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"
  
  const langMetadata: Record<string, { locale: string }> = {
    cs: { locale: "cs_CZ" },
    en: { locale: "en_US" },
    ru: { locale: "ru_RU" },
  }
  
  const meta = langMetadata[lang] || langMetadata.cs

  return {
    title: t.home.title,
    description: t.home.subtitle,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'cs': `${baseUrl}/cs`,
        'en': `${baseUrl}/en`,
        'ru': `${baseUrl}/ru`
      }
    },
    openGraph: {
      type: "website",
      locale: meta.locale,
      url: `${baseUrl}/${lang}`,
      siteName: "eXpansePi",
      title: t.home.title,
      description: t.home.subtitle,
    },
    twitter: {
      card: "summary_large_image",
      title: t.home.title,
      description: t.home.subtitle,
    },
  }
}

export default async function Home({ params }: HomePageProps) {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage

  return <HomeClient lang={lang} />
}

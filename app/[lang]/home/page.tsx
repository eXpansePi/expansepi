import { permanentRedirect } from "next/navigation"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"

export default async function LegacyHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  permanentRedirect(`/${isValidLanguage(lang) ? lang : defaultLanguage}`)
}
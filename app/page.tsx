import { redirect } from "next/navigation"
import { defaultLanguage } from "@/i18n/config"

export default function Home() {
  redirect(`/${defaultLanguage}`)
}

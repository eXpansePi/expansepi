"use client"

import Link from "next/link"
import Image from "next/image"
import { getRoutePath } from "@/lib/routes"
import type { Language } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"
import { resetConsent } from "@/lib/consent"

const labels = {
  cs: { cookies: "Nastavení cookies", tagline: "Praktické IT kurzy pro jednotlivce. Školení, AI, automatizace a software na míru pro firmy.", tools: "Partneři" },
  en: { cookies: "Cookie settings", tagline: "Practical IT courses for individuals. Training, AI, automation and custom software for businesses.", tools: "Partners" },
  ru: { cookies: "Настройки cookie", tagline: "Практические IT-курсы для частных лиц. Обучение, AI, автоматизация и разработка для компаний.", tools: "Партнёры" },
}

export default function Footer({ lang }: { lang: Language }) {
  const t = getTranslations(lang)
  const copy = labels[lang]
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand"><Link href={`/${lang}`} className="wordmark">eXpanse<span>Pi</span></Link><p>{copy.tagline}</p></div>
          <div>
            <h2 className="footer-heading">{t.footer.quickLinks}</h2>
            <ul className="footer-links">
              {(["courses", "business", "about", "contact"] as const).map(route => <li key={route}><Link href={getRoutePath(lang, route)}>{t.common[route]}</Link></li>)}
              <li><Link href={`/${lang}#otazky`}>{lang === "cs" ? "Časté otázky" : lang === "en" ? "Common questions" : "Частые вопросы"}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">{t.footer.moreInfo}</h2>
            <ul className="footer-links">
              {(["blog", "vacancies", "gdpr"] as const).map(route => <li key={route}><Link href={getRoutePath(lang, route)}>{t.common[route]}</Link></li>)}
              <li><button onClick={resetConsent}>{copy.cookies}</button></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h2 className="footer-heading">{t.contact.title}</h2>
            <div><a href="mailto:info@expansepi.com">info@expansepi.com</a><br /><a href="tel:+420775715700">+420 775 715 700</a></div>
            <p>{t.contact.addressValue}<br />{t.contact.ico}: {t.contact.icoValue}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} eXpansePi. {t.footer.copyright}</span>
          <div className="footer-tools" aria-label={copy.tools}>
            <a href="https://www.jetbrains.com/" target="_blank" rel="noopener noreferrer" aria-label="JetBrains"><Image src="/jetbrains/jetbrains.svg" alt="JetBrains" width={75} height={20} /></a>
            <a href="https://www.microsoft.com/" target="_blank" rel="noopener noreferrer" aria-label="Microsoft"><Image src="/microsoft/microsoft-white.svg" alt="Microsoft" width={87} height={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
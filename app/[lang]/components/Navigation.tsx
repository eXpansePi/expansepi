"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"
import { languages, langLabels, isValidLanguage, type Language } from "@/i18n/config"
import type { Translations } from "@/i18n/index"
import { getRoutePath, getPublicPath } from "@/lib/routes"

const labels = {
  cs: { how: "Jak to probíhá", funding: "Financování", faq: "Otázky", apply: "Chci začít", menu: "Otevřít menu", close: "Zavřít menu", skip: "Přejít k obsahu" },
  en: { how: "How it works", funding: "Funding", faq: "FAQ", apply: "Get started", menu: "Open menu", close: "Close menu", skip: "Skip to content" },
  ru: { how: "Обучение", funding: "Оплата", faq: "Вопросы", apply: "Начать", menu: "Открыть меню", close: "Закрыть меню", skip: "К содержимому" },
}

interface NavigationProps {
  activePage?: string
  applicationHref?: string
  lang: string
  t: Translations
}

export default function Navigation({ activePage, applicationHref, lang, t }: NavigationProps) {
  const currentLang: Language = isValidLanguage(lang) ? lang : "cs"
  const copy = labels[currentLang]
  const pathname = usePathname()
  const languageMenu = useRef<HTMLDetailsElement>(null)
  const mobileDialog = useRef<HTMLDialogElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const home = `/${currentLang}`
  const coursesPath = getRoutePath(currentLang, "courses")
  const onCoursePage = pathname?.startsWith(`${coursesPath}/`) || pathname?.startsWith(`/${currentLang}/kurzy/`)
  const applyHref = applicationHref || (onCoursePage && pathname ? `${getPublicPath(pathname, currentLang)}#prihlaska` : `${coursesPath}#nabidka`)
  const links = [
    { href: getRoutePath(currentLang, "courses"), label: t.common.courses },
    { href: `${home}#jak-to-probiha`, label: copy.how },
    { href: `${home}#financovani`, label: copy.funding },
    { href: getRoutePath(currentLang, "about"), label: t.common.about },
    { href: `${home}#otazky`, label: copy.faq },
  ]

  useEffect(() => {
    function closeLanguageMenu(event: PointerEvent) {
      if (!languageMenu.current?.contains(event.target as Node)) languageMenu.current?.removeAttribute("open")
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && languageMenu.current?.open) {
        languageMenu.current.open = false
        languageMenu.current.querySelector("summary")?.focus()
      }
    }
    document.addEventListener("pointerdown", closeLanguageMenu)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("pointerdown", closeLanguageMenu)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link href={home} className="wordmark" aria-label="eXpansePi">eXpanse<span>Pi</span></Link>
          <nav className="desktop-nav" aria-label={t.common.courses}>
            {links.map(link => <Link key={link.href} href={link.href} aria-current={activePage === link.href ? "page" : undefined}>{link.label}</Link>)}
          </nav>
          <div className="header-actions">
            <details className="language-switcher" ref={languageMenu}>
              <summary aria-label={t.nav.language}>{currentLang.toUpperCase()}<ChevronDown aria-hidden="true" /></summary>
              <ul>
                {languages.map(language => <li key={language}><Link href={getPublicPath(pathname || home, language)} hrefLang={language} lang={language} aria-current={language === currentLang ? "true" : undefined} onClick={() => languageMenu.current?.removeAttribute("open")}>{langLabels[language]}</Link></li>)}
              </ul>
            </details>
            <Link href={applyHref} className="button button-primary button-small header-apply">{copy.apply}<ArrowUpRight aria-hidden="true" /></Link>
            <button className="icon-button menu-toggle" aria-label={copy.menu} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={event => { event.currentTarget.focus(); mobileDialog.current?.showModal(); setMenuOpen(true) }}><Menu aria-hidden="true" /></button>
          </div>
        </div>
      </header>
      <dialog id="mobile-navigation" className="mobile-nav-dialog" ref={mobileDialog} aria-label={copy.menu} onClose={() => setMenuOpen(false)} onClick={event => { if (event.target === event.currentTarget) mobileDialog.current?.close() }}>
        <div className="mobile-nav-inner">
          <div className="mobile-nav-top">
            <Link href={home} className="wordmark" onClick={() => mobileDialog.current?.close()}>eXpanse<span>Pi</span></Link>
            <button className="icon-button" aria-label={copy.close} onClick={() => mobileDialog.current?.close()}><X aria-hidden="true" /></button>
          </div>
          <nav className="mobile-nav-links" aria-label={copy.menu}>
            {[...links, { href: getRoutePath(currentLang, "contact"), label: t.common.contact }].map(link => <Link key={link.href} href={link.href} onClick={() => mobileDialog.current?.close()}>{link.label}<ArrowUpRight aria-hidden="true" /></Link>)}
          </nav>
          <Link href={applyHref} className="button button-primary" onClick={() => mobileDialog.current?.close()}>{copy.apply}<ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </dialog>
    </>
  )
}
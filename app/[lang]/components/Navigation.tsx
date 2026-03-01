"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { languages, langLabels, isValidLanguage, type Language } from "@/i18n/config"
import { type Translations } from "@/i18n/index"
import { getRoutePath, getPublicPath } from "@/lib/routes"

// ─── Types ────────────────────────────────────────────────────────────────────

type DropdownItem = { href: string; label: string }

type NavLink =
  | { href: string; label: string; hasDropdown?: false }
  | { href: string; label: string; hasDropdown: true; dropdownItems: DropdownItem[] }

interface NavigationProps {
  activePage?: string
  lang: string
  t: Translations
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navigation({ activePage, lang, t }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false)
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const aboutMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const currentLang = (isValidLanguage(lang) ? lang : 'cs') as Language

  const navLinks: NavLink[] = [
    { href: getRoutePath(currentLang, 'home'), label: t.common.home },
    { href: getRoutePath(currentLang, 'courses'), label: t.common.courses },
    {
      href: getRoutePath(currentLang, 'about'),
      label: t.common.about,
      hasDropdown: true,
      dropdownItems: [
        { href: getRoutePath(currentLang, 'about'), label: t.nav.aboutMenu.whoWeAre },
        { href: `${getRoutePath(currentLang, 'about')}#team`, label: t.nav.aboutMenu.teamAndLecturers },
      ],
    },
    { href: getRoutePath(currentLang, 'contact'), label: t.common.contact },
    { href: getRoutePath(currentLang, 'vacancies'), label: t.common.vacancies },
  ]

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target as Node)) {
        setAboutMenuOpen(false)
      }
    }

    if (langMenuOpen || aboutMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [langMenuOpen, aboutMenuOpen])

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href={`/${currentLang}`} className="text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity drop-shadow-sm">
          <span className="text-gray-900">eXpanse</span><span className="text-blue-600">Pi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 text-gray-800">
          {navLinks.map((link) => {
            if (link.hasDropdown) {
              return (
                <div key={link.href} className="relative" ref={aboutMenuRef}>
                  <button
                    onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
                    aria-haspopup="true"
                    aria-expanded={aboutMenuOpen}
                    className={`transition-colors ${activePage === link.href
                        ? "text-blue-600 font-bold"
                        : "font-normal hover:text-blue-600"
                      } flex items-center gap-1`}
                  >
                    {link.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${aboutMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {aboutMenuOpen && (
                    <div
                      role="menu"
                      className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 min-w-[200px]"
                    >
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setAboutMenuOpen(false)}
                          className={`block px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition-colors ${activePage === item.href ? 'text-blue-600 bg-blue-50' : 'text-gray-800'
                            }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${activePage === link.href
                    ? "text-blue-600 font-bold"
                    : "font-normal hover:text-blue-600"
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Language Switcher + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label={t.nav.language}
              aria-expanded={langMenuOpen}
              aria-haspopup="true"
              className="p-2 text-gray-800 hover:text-blue-600 transition-colors font-semibold text-sm"
            >
              {currentLang.toUpperCase()}
            </button>
            {langMenuOpen && (
              <div role="menu" className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 min-w-[120px]">
                {languages.map(l => {
                  const currentPath = pathname || activePage || `/${currentLang}`
                  const newPath = getPublicPath(currentPath, l as Language)
                  return (
                    <Link
                      key={l}
                      href={newPath}
                      role="menuitem"
                      onClick={() => setLangMenuOpen(false)}
                      className={`block px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition-colors ${currentLang === l ? 'text-blue-600 bg-blue-50' : 'text-gray-800'
                        }`}
                    >
                      {langLabels[l]}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              if (mobileMenuOpen) {
                setShowAboutSubmenu(false)
              }
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-gray-800 hover:text-blue-600 transition-colors font-semibold"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="relative overflow-hidden bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-lg">
          {/* Main Menu */}
          <div
            className={`px-4 py-4 space-y-3 transition-transform duration-300 ease-in-out ${showAboutSubmenu ? '-translate-x-full absolute inset-0 w-full' : 'translate-x-0'
              }`}
          >
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <button
                    key={link.href}
                    onClick={() => setShowAboutSubmenu(true)}
                    className={`w-full text-left transition-colors ${activePage === link.href
                        ? "text-blue-600 font-bold"
                        : "text-gray-800 font-normal hover:text-blue-600"
                      } flex items-center justify-between`}
                  >
                    {link.label}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block transition-colors ${activePage === link.href
                      ? "text-blue-600 font-bold"
                      : "text-gray-800 font-normal hover:text-blue-600"
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* About Submenu */}
          <div
            className={`px-4 py-4 space-y-3 transition-transform duration-300 ease-in-out ${showAboutSubmenu ? 'translate-x-0' : 'translate-x-full absolute inset-0 w-full'
              }`}
          >
            <button
              onClick={() => setShowAboutSubmenu(false)}
              className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors mb-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">{t.common.about}</span>
            </button>
            {navLinks.find((link): link is NavLink & { hasDropdown: true } => link.hasDropdown === true)
              ?.dropdownItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setShowAboutSubmenu(false)
                    setMobileMenuOpen(false)
                  }}
                  className={`block py-2 transition-colors text-lg ${activePage === item.href ? 'text-blue-600 font-bold' : 'text-gray-800 hover:text-blue-600'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { languages, langLabels, isValidLanguage, type Language } from "@/i18n/config"
import { getRoutePath, getPublicPath } from "@/lib/routes"

interface NavigationProps {
  activePage?: string
  lang: string
  t: any
}

export default function Navigation({ activePage, lang, t }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const currentLang = (isValidLanguage(lang) ? lang : 'cs') as Language

  const navLinks = [
    { href: getRoutePath(currentLang, 'home'), label: t.common.home },
    { href: getRoutePath(currentLang, 'courses'), label: t.common.courses },
    { href: getRoutePath(currentLang, 'about'), label: t.common.about },
    { href: getRoutePath(currentLang, 'contact'), label: t.common.contact },
    { href: getRoutePath(currentLang, 'vacancies'), label: t.common.vacancies },
    { href: getRoutePath(currentLang, 'blog'), label: t.common.blog },
  ]

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }

    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [langMenuOpen])

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href={`/${currentLang}`} className="text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity drop-shadow-sm">
          <span className="text-gray-900">eXpanse</span><span className="text-blue-600">Pi</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 text-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                activePage === link.href 
                  ? "text-blue-600 font-bold" 
                  : "font-normal hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language Switcher + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 text-gray-800 hover:text-blue-600 transition-colors font-semibold text-sm"
              aria-label="Select language"
            >
              {currentLang.toUpperCase()}
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 min-w-[120px]">
                {languages.map(l => {
                  // Use actual pathname from Next.js router, fallback to activePage prop
                  // Note: pathname may return internal route after rewrite, so we convert it
                  const currentPath = pathname || activePage || `/${currentLang}`
                  // Convert internal route to public route for target language
                  const newPath = getPublicPath(currentPath, l as Language)
                  return (
                    <Link
                      key={l}
                      href={newPath}
                      onClick={() => setLangMenuOpen(false)}
                      className={`block px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition-colors ${
                        currentLang === l ? 'text-blue-600 bg-blue-50' : 'text-gray-800'
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-800 hover:text-blue-600 transition-colors font-semibold"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-3 bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block transition-colors ${
                activePage === link.href 
                  ? "text-blue-600 font-bold" 
                  : "text-gray-800 font-normal hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

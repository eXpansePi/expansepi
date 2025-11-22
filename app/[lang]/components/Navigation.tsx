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
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const aboutMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const currentLang = (isValidLanguage(lang) ? lang : 'cs') as Language

  const navLinks = [
    { href: getRoutePath(currentLang, 'home'), label: t.common.home },
    { href: getRoutePath(currentLang, 'courses'), label: t.common.courses },
    { 
      href: getRoutePath(currentLang, 'about'), 
      label: t.common.about,
      hasDropdown: true,
      dropdownItems: [
        { href: getRoutePath(currentLang, 'about'), label: (t.about as any)?.whoWeAre || (currentLang === 'cs' ? 'Kdo jsme' : currentLang === 'en' ? 'Who We Are' : 'Кто мы') },
        { href: `${getRoutePath(currentLang, 'about')}#team`, label: currentLang === 'cs' ? 'Náš tým a lektoři' : currentLang === 'en' ? 'Our Team and Lecturers' : 'Наша команда и лекторы' },
      ]
    },
    { href: getRoutePath(currentLang, 'contact'), label: t.common.contact },
    { href: getRoutePath(currentLang, 'vacancies'), label: t.common.vacancies },
  ]

  // Close menus when pathname changes (navigation completed)
  useEffect(() => {
    setAboutMenuOpen(false)
    setMobileMenuOpen(false)
  }, [pathname])

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
            if ((link as any).hasDropdown) {
              return (
                <div key={link.href} className="relative" ref={aboutMenuRef}>
                  <button
                    onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
                    className={`transition-colors ${
                      activePage === link.href 
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
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {aboutMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 min-w-[200px] w-full">
                      {(link as any).dropdownItems.map((item: any) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block w-full px-4 py-3 text-sm font-semibold hover:bg-blue-50 transition-colors min-h-[44px] flex items-center ${
                            activePage === item.href ? 'text-blue-600 bg-blue-50' : 'text-gray-800'
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
                className={`transition-colors ${
                  activePage === link.href 
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
          {navLinks.map((link) => {
            if ((link as any).hasDropdown) {
              return (
                <div key={link.href}>
                  <button
                    onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
                    className={`w-full text-left transition-colors ${
                      activePage === link.href 
                        ? "text-blue-600 font-bold" 
                        : "text-gray-800 font-normal hover:text-blue-600"
                    } flex items-center justify-between`}
                  >
                    {link.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${aboutMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {aboutMenuOpen && (
                    <div className="mt-2 -mx-4">
                      {(link as any).dropdownItems.map((item: any) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block w-full px-4 py-3 text-sm transition-colors min-h-[44px] flex items-center touch-manipulation ${
                            activePage === item.href ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
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
                onClick={() => setMobileMenuOpen(false)}
                className={`block transition-colors ${
                  activePage === link.href 
                    ? "text-blue-600 font-bold" 
                    : "text-gray-800 font-normal hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

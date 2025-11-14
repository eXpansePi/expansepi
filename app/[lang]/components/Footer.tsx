"use client"

import Link from "next/link"
import { isValidLanguage, type Language } from "@/i18n/config"
import { getRoutePath } from "@/lib/routes"

interface FooterProps {
  lang: string
  t: any
}

export default function Footer({ lang, t }: FooterProps) {
  const currentLang = (isValidLanguage(lang) ? lang : 'cs') as Language

  const footerLinks = [
    { href: getRoutePath(currentLang, 'home'), label: t.common.home },
    { href: getRoutePath(currentLang, 'courses'), label: t.common.courses },
    { href: getRoutePath(currentLang, 'about'), label: t.common.about },
    { href: getRoutePath(currentLang, 'contact'), label: t.common.contact },
    { href: getRoutePath(currentLang, 'vacancies'), label: t.common.vacancies },
    { href: getRoutePath(currentLang, 'blog'), label: t.common.blog },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href={`/${currentLang}`} className="text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity mb-4 inline-block">
              <span className="text-white">eXpanse</span><span className="text-blue-400">Pi</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {currentLang === 'cs' 
                ? 'IT kurzy plně hrazené Úřadem práce ČR'
                : currentLang === 'en'
                ? 'IT courses fully funded by the Czech Labour Office'
                : 'IT курсы, полностью финансируемые Чешским центром занятости'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
              {currentLang === 'cs' ? 'Rychlé odkazy' : currentLang === 'en' ? 'Quick Links' : 'Быстрые ссылки'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
              {currentLang === 'cs' ? 'Více informací' : currentLang === 'en' ? 'More Info' : 'Больше информации'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.slice(3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
              {t.common.contact}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="mailto:info@expansepi.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  info@expansepi.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © {currentYear} eXpansePi. {currentLang === 'cs' ? 'Všechna práva vyhrazena.' : currentLang === 'en' ? 'All rights reserved.' : 'Все права защищены.'}
            </p>
            <div className="flex gap-4 text-xs sm:text-sm text-gray-500">
              <Link
                href={getRoutePath(currentLang, 'about')}
                className="hover:text-blue-400 transition-colors"
              >
                {currentLang === 'cs' ? 'O nás' : currentLang === 'en' ? 'About' : 'О нас'}
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href={getRoutePath(currentLang, 'contact')}
                className="hover:text-blue-400 transition-colors"
              >
                {t.common.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


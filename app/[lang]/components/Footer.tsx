import Link from "next/link"
import { getRoutePath } from "@/lib/routes"
import { type Language } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"

interface FooterProps {
  lang: Language
}

export default function Footer({ lang }: FooterProps) {
  const t = getTranslations(lang)

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 sm:mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3 sm:mb-4">eXpansePi</h3>
            <p className="text-sm leading-relaxed">
              {lang === 'cs' 
                ? 'IT vzdělávání budoucnosti. Rekvalifikační kurzy s experty z Matfyzu UK a ČVUT.'
                : lang === 'en'
                ? 'IT education of the future. Reskilling courses with experts from Charles University and Czech Technical University.'
                : 'IT образование будущего. Курсы переквалификации с экспертами из Карлова университета и Чешского технического университета.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4">
              {lang === 'cs' ? 'Rychlé odkazy' : lang === 'en' ? 'Quick Links' : 'Быстрые ссылки'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={getRoutePath(lang, 'home')} className="hover:text-white transition-colors">
                  {t.common.home}
                </Link>
              </li>
              <li>
                <Link href={getRoutePath(lang, 'courses')} className="hover:text-white transition-colors">
                  {t.common.courses}
                </Link>
              </li>
              <li>
                <Link href={getRoutePath(lang, 'about')} className="hover:text-white transition-colors">
                  {t.common.about}
                </Link>
              </li>
              <li>
                <Link href={getRoutePath(lang, 'contact')} className="hover:text-white transition-colors">
                  {t.common.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4">
              {lang === 'cs' ? 'Více informací' : lang === 'en' ? 'More Information' : 'Больше информации'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={getRoutePath(lang, 'vacancies')} className="hover:text-white transition-colors">
                  {t.common.vacancies}
                </Link>
              </li>
              <li>
                <Link href={getRoutePath(lang, 'blog')} className="hover:text-white transition-colors">
                  {t.common.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4">
              {t.contact.title}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">{t.contact.address}:</span>
                <br />
                <span>{t.contact.addressValue}</span>
              </li>
              <li>
                <span className="text-gray-400">{t.contact.ico}:</span> {t.contact.icoValue}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} eXpansePi. {lang === 'cs' ? 'Všechna práva vyhrazena.' : lang === 'en' ? 'All rights reserved.' : 'Все права защищены.'}
          </p>
        </div>
      </div>
    </footer>
  )
}

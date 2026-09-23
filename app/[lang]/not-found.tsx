import Link from "next/link"
import { languages } from "@/i18n/config"
import { getRoutePath } from "@/lib/routes"

/**
 * The not-found boundary receives no route params, and client hooks do not run
 * inside it, so the locale cannot be detected here. Every language is offered
 * instead of guessing one.
 */
const copy = {
  cs: { title: "Stránku jsme nenašli", courses: "Katalog kurzů", home: "Úvodní stránka" },
  en: { title: "We could not find that page", courses: "Course catalogue", home: "Homepage" },
  ru: { title: "Страница не найдена", courses: "Каталог курсов", home: "Главная страница" },
}

export default function NotFound() {
  return (
    <main id="main-content" className="site-main">
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">404</p>
          <h1 lang="cs">{copy.cs.title}</h1>
          <ul className="footer-links">
            {languages.map(lang => (
              <li key={lang} lang={lang}>
                <Link href={`/${lang}`}>{copy[lang].home}</Link>
                <span aria-hidden="true"> / </span>
                <Link href={getRoutePath(lang, "courses")}>{copy[lang].courses}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

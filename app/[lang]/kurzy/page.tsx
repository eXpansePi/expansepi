import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, ShieldCheck } from "lucide-react"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { SectionHeading } from "../components/CourseSections"
import { CourseGrid } from "./components/CourseCard"
import { getTranslations } from "@/i18n/index"
import { getSiteCopy } from "@/i18n/site"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getActiveCourses, getUpcomingCourses } from "@/data/courses"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"

export const revalidate = 3600

interface CoursesPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: CoursesPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const copy = getSiteCopy(lang)
  const title = getTranslations(lang).courses.title
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"
  const url = `${baseUrl}${getRoutePath(lang, "courses")}`
  const routes = getAllRoutePaths("courses")

  return {
    title,
    description: copy.listing.intro,
    alternates: {
      canonical: url,
      languages: {
        cs: `${baseUrl}${routes.cs}`,
        en: `${baseUrl}${routes.en}`,
        ru: `${baseUrl}${routes.ru}`,
        "x-default": `${baseUrl}${routes.cs}`,
      },
    },
    openGraph: { title, description: copy.listing.intro, url, siteName: "eXpansePi", type: "website", locale: lang === "cs" ? "cs_CZ" : lang === "en" ? "en_US" : "ru_RU" },
    twitter: { card: "summary", title, description: copy.listing.intro },
  }
}

export default async function CoursesPage({ params }: CoursesPageProps) {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const copy = getSiteCopy(lang)
  const activeCourses = getActiveCourses(lang)
  const upcomingCourses = getUpcomingCourses(lang)

  return (
    <>
      <Navigation activePage={getRoutePath(lang, "courses")} lang={lang} t={t} />
      <main id="main-content" className="site-main">
        <section className="page-intro">
          <div className="container">
            <p className="eyebrow">{t.common.courses} / eXpansePi</p>
            <h1>{copy.listing.title}</h1>
            <p className="lead">{copy.listing.intro}</p>
            <a className="text-link" href={`/${lang}#financovani`}><ShieldCheck aria-hidden="true" />{copy.hero.funding}<ArrowUpRight aria-hidden="true" /></a>
          </div>
        </section>
        <section className="section surface-section" id="nabidka" aria-labelledby="available-title">
          <div className="container">
            <SectionHeading eyebrow={copy.catalog.eyebrow} title={copy.catalog.available} id="available-title" />
            {activeCourses.length > 0 ? <CourseGrid courses={activeCourses} lang={lang} /> : <p className="catalog-empty">{copy.catalog.empty}</p>}
            <div className="course-list-footer"><p className="fine-print">{copy.course.datesNote}</p><Link className="text-link" href={getRoutePath(lang, "contact")}>{copy.catalog.help}<ArrowUpRight aria-hidden="true" /></Link></div>
          </div>
        </section>
        {upcomingCourses.length > 0 && (
          <section className="section-tight" aria-labelledby="preparing-title">
            <div className="container">
              <details className="planned-courses">
                <summary><h2 id="preparing-title"><span>{copy.listing.upcomingTitle}</span><span className="planned-count">{upcomingCourses.length}</span><ChevronDown aria-hidden="true" /></h2></summary>
                <p>{copy.listing.upcomingText}</p>
                <CourseGrid courses={upcomingCourses} lang={lang} />
              </details>
            </div>
          </section>
        )}
        <section className="section-tight surface-section catalog-contact">
          <div className="container"><Link className="text-link" href={getRoutePath(lang, "contact")}>{copy.listing.contact}<ArrowUpRight aria-hidden="true" /></Link></div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  )
}
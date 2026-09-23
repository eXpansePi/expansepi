import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowUpRight, CalendarDays, ShieldCheck } from "lucide-react"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"
import { getSiteCopy } from "@/i18n/site"
import { getActiveCourses, getUpcomingCourses } from "@/data/courses"
import { getUpcomingSessions, formatCourseDate } from "@/lib/course-schedule"
import { getDetailRoutePath, getRoutePath } from "@/lib/routes"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import HeroScene from "./components/HeroScene"
import PartnerSection from "./components/PartnerSection"
import { CourseGrid } from "./kurzy/components/CourseCard"
import { ApplicationSection, AudienceSection, CourseFormatSection, FAQSection, FundingSection, SectionHeading, TeamSection } from "./components/CourseSections"

export const revalidate = 3600

interface HomePageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const copy = getSiteCopy(lang)
  const title = `${copy.hero.title} ${copy.hero.accent} | eXpansePi`
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"

  const langMetadata: Record<string, { locale: string }> = {
    cs: { locale: "cs_CZ" },
    en: { locale: "en_US" },
    ru: { locale: "ru_RU" },
  }

  const meta = langMetadata[lang] || langMetadata.cs

  return {
    title: { absolute: title },
    description: copy.hero.description,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'cs': `${baseUrl}/cs`,
        'en': `${baseUrl}/en`,
        'ru': `${baseUrl}/ru`,
        'x-default': `${baseUrl}/cs`
      }
    },
    openGraph: {
      type: "website",
      locale: meta.locale,
      url: `${baseUrl}/${lang}`,
      siteName: "eXpansePi",
      title,
      description: copy.hero.description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.hero.description,
    },
  }
}

export default async function Home({ params }: HomePageProps) {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const copy = getSiteCopy(lang)
  const courses = getActiveCourses(lang)
  const upcoming = getUpcomingCourses(lang)
  const nextCohort = courses.flatMap(course => {
    const session = getUpcomingSessions(course.sessions)[0]
    return session ? [{ course, session }] : []
  }).sort((first, second) => first.session.start.localeCompare(second.session.start))[0]

  return (
    <>
      <Navigation activePage={`/${lang}`} lang={lang} t={t} />
      <main id="main-content" className="site-main">
        <section className="hero" aria-labelledby="hero-title">
          <HeroScene label={copy.hero.visualLabel} word={copy.hero.visualWord} />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow subtle-enter">{copy.hero.eyebrow}</p>
              <h1 id="hero-title" className="subtle-enter">{copy.hero.title}<span>{copy.hero.accent}</span></h1>
              <p className="hero-description subtle-enter-later">{copy.hero.description}</p>
              <div className="button-row subtle-enter-later"><a className="button button-primary" href="#kurzy">{copy.hero.primary}<ArrowUpRight aria-hidden="true" /></a><a className="text-link" href="#jak-to-probiha">{copy.hero.secondary}<ArrowDown aria-hidden="true" /></a></div>
              <a className="hero-funding" href="#financovani"><ShieldCheck aria-hidden="true" /><span><strong>{copy.hero.funding}</strong>{copy.hero.fundingNote}</span></a>
              {nextCohort && <Link className="hero-next" href={getDetailRoutePath(lang, "courses", nextCohort.course.slug)}><CalendarDays aria-hidden="true" /><span><span>{copy.course.next}: <time dateTime={nextCohort.session.start}>{formatCourseDate(nextCohort.session.start, lang)}</time></span><strong>{nextCohort.course.title}</strong></span><ArrowUpRight aria-hidden="true" /></Link>}
            </div>
          </div>
        </section>
        <PartnerSection lang={lang} />
        <section className="section surface-section" id="kurzy" aria-labelledby="catalog-title">
          <div className="container">
            <SectionHeading eyebrow={copy.catalog.eyebrow} title={copy.catalog.title} text={copy.catalog.intro} id="catalog-title" />
            {courses.length > 0 ? <CourseGrid courses={courses.slice(0, 6)} lang={lang} /> : <p className="catalog-empty">{copy.catalog.empty}</p>}
            <div className="course-list-footer"><p className="fine-print">{copy.course.datesNote}</p><Link href={getRoutePath(lang, "courses")} className="text-link">{copy.catalog.all}<ArrowUpRight aria-hidden="true" /></Link></div>
            {upcoming.length > 0 && <div className="catalog-planned"><div><h3>{copy.catalog.preparing}</h3><p>{copy.catalog.plannedNote}</p></div><ul className="planned-topics">{upcoming.map(course => <li key={course.slug}>{course.topics?.[0] || course.title}</li>)}</ul></div>}
          </div>
        </section>
        <AudienceSection copy={copy.audience} />
        <CourseFormatSection copy={copy.homeFormat} />
        <FundingSection copy={copy.funding} />
        <TeamSection lang={lang} />
        <FAQSection copy={copy.faq} />
        <ApplicationSection lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}

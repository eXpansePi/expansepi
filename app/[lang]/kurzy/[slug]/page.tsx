import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight, ChevronRight, ShieldCheck } from "lucide-react"
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import LearningJourney from "../../components/LearningJourney"
import { ApplicationSection, CourseFacts, CourseFormatSection, CoursePrice, FAQSection, FundingSection, SectionHeading, TeamSection } from "../../components/CourseSections"
import ApplyButton from "./components/ApplyButton"
import PyCharmPromo from "./components/PyCharmPromo"
import { JsonLd } from "@/app/components/JsonLd"
import { getTranslations } from "@/i18n/index"
import { getSiteCopy } from "@/i18n/site"
import { isValidLanguage, defaultLanguage, languages } from "@/i18n/config"
import { getAllCourses, getCourseBySlug } from "@/data/courses"
import { getCourseSchema, getBreadcrumbSchema } from "@/lib/seo"
import { getUpcomingSessions, formatCourseDate } from "@/lib/course-schedule"
import { getRoutePath, getDetailRoutePath, getAllDetailRoutePaths } from "@/lib/routes"

export const revalidate = 3600

interface CourseDetailProps {
  params: Promise<{ lang: string; slug: string }>
}

export function generateStaticParams() {
  return getAllCourses().flatMap(course => languages.map(lang => ({ lang, slug: course.slug })))
}

export async function generateMetadata({ params }: CourseDetailProps): Promise<Metadata> {
  const { lang: routeLang, slug } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const course = getCourseBySlug(slug, lang)
  if (!course) return { title: getTranslations(lang).common.notFound, robots: { index: false } }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"
  const url = `${baseUrl}${getDetailRoutePath(lang, "courses", slug)}`
  const routes = getAllDetailRoutePaths("courses", slug)
  const description = course.summary || course.description

  return {
    title: course.title,
    description,
    ...(course.status === "upcoming" && { robots: { index: false, follow: true } }),
    alternates: { canonical: url, languages: { cs: `${baseUrl}${routes.cs}`, en: `${baseUrl}${routes.en}`, ru: `${baseUrl}${routes.ru}`, "x-default": `${baseUrl}${routes.cs}` } },
    openGraph: { title: course.title, description, url, siteName: "eXpansePi", locale: lang === "cs" ? "cs_CZ" : lang === "en" ? "en_US" : "ru_RU", type: "website" },
    twitter: { card: "summary", title: course.title, description },
  }
}

export default async function CourseDetail({ params }: CourseDetailProps) {
  const { lang: routeLang, slug } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const t = getTranslations(lang)
  const copy = getSiteCopy(lang)
  const course = getCourseBySlug(slug, lang)
  if (!course) notFound()

  const active = course.status === "active"
  const pythonExperience = course.experience === "python-web"
  const sessions = getUpcomingSessions(course.sessions)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"
  const courseUrl = `${baseUrl}${getDetailRoutePath(lang, "courses", slug)}`
  const breadcrumbs = getBreadcrumbSchema([
    { name: t.common.home, url: `${baseUrl}/${lang}` },
    { name: t.common.courses, url: `${baseUrl}${getRoutePath(lang, "courses")}` },
    { name: course.title, url: courseUrl },
  ])
  const applyLabel = lang === "cs" ? "Přihláška" : lang === "en" ? "Apply" : "Заявка"

  return (
    <div className={active ? "course-page" : undefined}>
      {active && <JsonLd data={getCourseSchema(course, lang, courseUrl)} />}
      <JsonLd data={breadcrumbs} />
      <Navigation activePage={getRoutePath(lang, "courses")} applicationHref={active ? undefined : `${getRoutePath(lang, "courses")}#nabidka`} lang={lang} t={t} />
      <main id="main-content" className="site-main">
        <section className="course-hero">
          <div className="container">
            <nav className="breadcrumbs" aria-label={t.common.courses}><Link href={`/${lang}`}>eXpansePi</Link><ChevronRight aria-hidden="true" /><Link href={getRoutePath(lang, "courses")}>{t.common.courses}</Link></nav>
            <div className={`course-hero-grid${active ? "" : " course-hero-draft"}`}>
              <div className="course-hero-copy">
                <div className="course-tags"><span className="tag tag-blue">{active ? sessions.length ? copy.course.available : copy.course.pending : copy.catalog.planned}</span>{course.accreditation && <span className="tag"><ShieldCheck aria-hidden="true" />{course.accreditation}</span>}</div>
                <h1>{course.title}</h1>
                <p className="lead">{course.summary || course.description}</p>
                {course.topics && <ul className="catalog-topics">{course.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>}
                {!active && <><p className="fine-print">{copy.catalog.plannedNote}</p><Link className="button button-primary" href={getRoutePath(lang, "contact")}>{copy.catalog.help}<ArrowUpRight aria-hidden="true" /></Link></>}
              </div>
              {active && <aside className="course-summary" aria-label={copy.course.details}><CoursePrice course={course} lang={lang} showFunding={false} /><ApplyButton courseTitle={course.title} lang={lang} /><p className="fine-print course-application-note">{copy.course.applicationNote}</p>{course.funding && <a className="course-funding-link" href="#financovani"><ShieldCheck aria-hidden="true" />{course.funding}<ArrowUpRight aria-hidden="true" /></a>}</aside>}
            </div>
            {active && <div className="course-overview"><CourseFacts course={course} lang={lang} showEnd /><p className="fine-print">{copy.course.datesNote}</p></div>}
            {active && <PyCharmPromo lang={lang} license={course.softwareLicense} />}
          </div>
        </section>
        {active && <>
          <nav className="course-local-nav" aria-label={copy.course.details}><div className="container"><a href="#osnova">{copy.course.fullSyllabus}</a>{pythonExperience && <a href="#jak-to-probiha">{copy.homeFormat.title}</a>}{course.funding && <a href="#financovani">{copy.funding.title}</a>}<a href="#team">{copy.team.title}</a><a href="#otazky">{copy.faq.title}</a><a href="#prihlaska">{applyLabel}</a></div></nav>
          <section className="section" id="osnova" aria-labelledby="syllabus-title"><div className="container"><SectionHeading eyebrow={copy.course.fullSyllabus} title={copy.course.syllabus} text={pythonExperience ? copy.course.syllabusIntro : undefined} id="syllabus-title" />{course.syllabus?.length ? <ol className="curriculum-list">{course.syllabus.map(topic => <li key={topic}>{topic}</li>)}</ol> : <p className="fine-print">{lang === "cs" ? "Podrobný obsah připravujeme. Před přihlášením si vyžádejte aktuální sylabus." : lang === "en" ? "The detailed curriculum is being prepared. Request the current syllabus before enrolling." : "Подробная программа готовится. Запросите актуальное содержание до записи."}</p>}<div className="assessment-row">{course.exam && <div><h3>{copy.course.exam}</h3><p>{course.exam}</p></div>}{course.certification && <div><h3>{copy.course.certificate}</h3><p>{course.certification}</p></div>}</div></div></section>
          {pythonExperience && <><LearningJourney copy={copy.journey} /><CourseFormatSection copy={copy.format} /></>}
          {sessions.length > 1 && <section className="section-tight surface-section"><div className="container"><h2 className="section-title">{copy.course.available}</h2><ul className="session-list">{sessions.map(session => <li key={session.start}><time dateTime={session.start}>{formatCourseDate(session.start, lang)}</time><span aria-hidden="true"> / </span><time dateTime={session.end}>{formatCourseDate(session.end, lang)}</time></li>)}</ul></div></section>}
          {course.funding && <FundingSection copy={copy.funding} course={course} lang={lang} />}
          <TeamSection lang={lang} />
          <FAQSection copy={{ ...copy.faq, items: course.faq?.length ? course.faq : copy.faq.items }} />
          <ApplicationSection course={course} lang={lang} />
        </>}
      </main>
      <Footer lang={lang} />
      {active && <div className="course-sticky"><div className="course-sticky-content"><div className="course-sticky-copy"><strong>{course.topics?.[0] || t.common.courses}</strong>{sessions[0] ? formatCourseDate(sessions[0].start, lang) : copy.course.noDate}</div><a href="#prihlaska" className="button button-primary button-small" aria-label={`${copy.apply.button}: ${course.title}`}>{applyLabel}<ArrowUpRight aria-hidden="true" /></a></div></div>}
    </div>
  )
}
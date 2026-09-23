import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays, Clock3, GraduationCap, Monitor, Plus, ShieldCheck } from "lucide-react"
import type { Language } from "@/i18n/config"
import { getSiteCopy, type SiteCopy } from "@/i18n/site"
import type { Course } from "@/types/course"
import type { Lecturer, TeamMember } from "@/types/team"
import { getAllLecturers, getAllTeamMembers, getLecturerCredentials } from "@/data/team"
import { getRoutePath, getDetailRoutePath } from "@/lib/routes"
import { getUpcomingSessions, formatCourseDate } from "@/lib/course-schedule"
import ApplyButton from "../kurzy/[slug]/components/ApplyButton"

export function SectionHeading({ eyebrow, title, text, id }: { eyebrow?: string; title: string; text?: string; id?: string }) {
  return <header className={`section-header${text ? "" : " section-header-solo"}`}><div className="section-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="section-title" id={id}>{title}</h2></div>{text && <p className="section-intro">{text}</p>}</header>
}

export function CourseFacts({ course, lang, showEnd = false }: { course: Course; lang: Language; showEnd?: boolean }) {
  const copy = getSiteCopy(lang).course
  const session = getUpcomingSessions(course.sessions)[0]
  const pending = lang === "cs" ? "Upřesníme" : lang === "en" ? "To be confirmed" : "Уточняется"
  const facts = [
    { icon: CalendarDays, label: copy.next, value: session ? formatCourseDate(session.start, lang) : copy.noDate, date: session?.start },
    ...(showEnd && session ? [{ icon: CalendarDays, label: copy.end, value: formatCourseDate(session.end, lang), date: session.end }] : []),
    { icon: Clock3, label: copy.hours, value: course.durationLabel || course.duration || pending },
    { icon: Monitor, label: copy.format, value: course.formatLabel || course.form || pending },
    { icon: GraduationCap, label: copy.level, value: course.levelLabel || course.level },
  ]
  return <dl className="course-facts" data-count={facts.length}>{facts.map(({ icon: Icon, label, value, date }) => <div className="fact" key={label}><dt><Icon aria-hidden="true" /><span>{label}</span></dt><dd>{date ? <time dateTime={date}>{value}</time> : value}</dd></div>)}</dl>
}

export function CoursePrice({ course, lang, label, showFunding = true }: { course: Course; lang: Language; label?: string; showFunding?: boolean }) {
  const copy = getSiteCopy(lang).course
  const note = course.price == null ? copy.priceNote : showFunding ? course.funding : undefined
  return <div className="price-inline"><span>{label || copy.price}</span><strong>{course.price == null ? copy.pricePending : new Intl.NumberFormat(lang, { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(course.price)}</strong>{note && <p>{note}</p>}</div>
}

export function FeaturedCourse({ course, lang }: { course: Course; lang: Language }) {
  const copy = getSiteCopy(lang).course
  const hasDates = getUpcomingSessions(course.sessions).length > 0
  return (
    <article className="featured-course">
      <div className="featured-course-content">
        <div className="course-tags"><span className="tag tag-blue">{hasDates ? copy.available : copy.pending}</span>{course.accreditation && <span className="tag"><ShieldCheck aria-hidden="true" />{course.accreditation}</span>}</div>
        <h3>{course.title}</h3><p>{course.summary || course.description}</p>
        {course.topics && <div className="tech-list">{course.topics.map(topic => <span key={topic}>{topic}</span>)}</div>}
        <Link href={getDetailRoutePath(lang, "courses", course.slug)} className="button button-primary">{copy.details}<ArrowUpRight aria-hidden="true" /></Link>
      </div>
      <div className="featured-course-meta"><CourseFacts course={course} lang={lang} /><CoursePrice course={course} lang={lang} /></div>
    </article>
  )
}

export function AudienceSection({ copy }: { copy: SiteCopy["audience"] }) {
  return <section className="section audience-section" aria-labelledby="audience-title"><div className="container"><SectionHeading eyebrow={copy.eyebrow} title={copy.title} text={copy.intro} id="audience-title" /><div className="audience-grid">{copy.items.map(item => <div className="audience-item" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div></div></section>
}

export function CourseFormatSection({ copy }: { copy: SiteCopy["format"] }) {
  return <section className="section format-section" id="jak-to-probiha" aria-labelledby="format-title"><div className="container"><SectionHeading eyebrow={copy.eyebrow} title={copy.title} text={copy.intro} id="format-title" /><div className={`format-grid${copy.items.length === 3 ? " format-grid-three" : ""}`}>{copy.items.map(item => <div className="format-item" key={item.title}><span className="format-value">{item.value}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}</div><p className="format-note">{copy.note}</p></div></section>
}

function ProcessSteps({ steps }: { steps: SiteCopy["funding"]["steps"] }) {
  return <ol className="steps-list process-steps">{steps.map((step, index) => <li key={step.title}><span className="step-marker" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
}

export function FundingSection({ copy, course, lang }: { copy: SiteCopy["funding"]; course?: Course; lang?: Language }) {
  return (
    <section className="section surface-section" id="financovani" aria-labelledby="funding-title">
      <div className="container">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} text={course ? course.funding : copy.intro} id="funding-title" />
        <div className={`funding-options${course ? " funding-options-course" : ""}`}>
          <div className="funding-amount"><strong>{copy.amount}</strong><div><span>{copy.amountNote}</span><p>{copy.contribution}</p></div></div>
          <div className="funding-price">{course && lang ? <CoursePrice course={course} lang={lang} label={copy.priceTitle} showFunding={false} /> : <h3>{copy.priceTitle}</h3>}<p>{course && lang ? copy.coursePriceNote : copy.priceNote}</p></div>
        </div>
        <div className="funding-details">
          <ProcessSteps steps={copy.steps} />
          <div className="section-footnote"><p className="funding-disclaimer">{copy.disclaimer}</p><a className="text-link" href="https://up.gov.cz/zvolena-rekvalifikace" target="_blank" rel="noopener noreferrer">{copy.official}<ArrowUpRight aria-hidden="true" /></a></div>
        </div>
      </div>
    </section>
  )
}

export function PersonCard({ person, copy, compact = false }: { person: Lecturer | TeamMember; copy: SiteCopy["team"]; compact?: boolean }) {
  const initials = person.name.split(" ").map(part => part[0]).slice(0, 2).join("")
  const description = compact && person.summary ? person.summary : "role" in person && person.role === "founder" ? copy.founderNote : person.description
  const identity = [...person.title.split("\n").filter(Boolean), ...("role" in person ? [] : [...(person.currentEmployers || []), ...(person.universities || [])])].join(" · ")
  return (
    <article className={`person-card${person.photo ? "" : " person-card-no-photo"}`} id={`lecturer-${person.id}`}>
      <div className="person-portrait" title={!person.photo ? copy.portraitPending : undefined}>
        {person.photo ? <Image src={person.photo} alt={person.name} fill sizes="(max-width: 767px) 56px, 80px" className="object-cover" /> : <><span className="person-initials" aria-hidden="true">{initials}</span><span className="sr-only">{copy.portraitPending}</span></>}
      </div>
      <div className="person-body"><div className="person-heading"><h3>{person.name}</h3><p className="person-role">{identity}</p><div className="person-skills" aria-label={copy.expertise}>{person.specializations?.slice(0, 3).map(skill => <span key={skill}>{skill}</span>)}</div></div><p className="person-description">{description}</p></div>
    </article>
  )
}

export function TeamSection({ lang, full = false }: { lang: Language; full?: boolean }) {
  const copy = getSiteCopy(lang).team
  const people = [...getAllTeamMembers(lang), ...getAllLecturers(lang)]
  const credentials = getLecturerCredentials(lang)
  const featured = full ? people : [people.find(person => person.id === "5"), people.find(person => person.id === "example-founder"), people.find(person => person.id === "2")].filter((person): person is Lecturer | TeamMember => !!person)
  return (
    <section className="section" id="team" aria-labelledby="team-title">
      <div className="container">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} text={copy.intro} id="team-title" />
        {(credentials.universities.length > 0 || credentials.currentEmployers.length > 0) && <dl className="team-credentials">
          {credentials.universities.length > 0 && <div className="team-credential">
            <dt><GraduationCap aria-hidden="true" />{copy.educationLabel}</dt>
            <dd><ul className="team-credential-names" role="list">{credentials.universities.map(name => <li key={name}>{name}</li>)}</ul></dd>
            <dd className="team-credential-detail">{copy.educationDetail}</dd>
          </div>}
          {credentials.currentEmployers.length > 0 && <div className="team-credential">
            <dt><BriefcaseBusiness aria-hidden="true" />{copy.experienceLabel}</dt>
            <dd><ul className="team-credential-names" role="list">{credentials.currentEmployers.map(name => <li key={name}>{name}</li>)}</ul></dd>
            <dd className="team-credential-detail">{copy.experienceDetail}</dd>
          </div>}
        </dl>}
        <div className="team-grid">{featured.map(person => <PersonCard key={person.id} person={person} copy={copy} compact={!full} />)}</div>
        <div className="team-bottom"><p className="fine-print">{copy.companyNote}</p>{!full && <Link href={getRoutePath(lang, "about")} className="text-link">{copy.all}<ArrowUpRight aria-hidden="true" /></Link>}</div>
      </div>
    </section>
  )
}

export function CareerSection({ copy }: { copy: SiteCopy["career"] }) {
  return <section className="section-tight dark-section" aria-labelledby="career-title"><div className="container career-layout"><SectionHeading eyebrow={copy.eyebrow} title={copy.title} text={copy.text} id="career-title" /><ul className="career-roles">{copy.roles.map(role => <li key={role}>{role}</li>)}</ul><p className="fine-print career-note">{copy.disclaimer}</p></div></section>
}

export function FAQSection({ copy }: { copy: SiteCopy["faq"] }) {
  const rows = Array.from({ length: Math.ceil(copy.items.length / 2) }, (_, index) => copy.items.slice(index * 2, index * 2 + 2))
  return <section className="section" id="otazky" aria-labelledby="faq-title"><div className="container"><SectionHeading eyebrow={copy.eyebrow} title={copy.title} text={copy.intro} id="faq-title" /><div className="faq-columns">{rows.map((items, index) => <div className="faq-row" key={index}>{items.map(item => <details key={item.question} className="faq-item"><summary>{item.question}<Plus aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>)}</div></div></section>
}

export function ApplicationSection({ course, lang }: { course?: Course; lang: Language }) {
  const copy = getSiteCopy(lang).apply
  const catalog = getSiteCopy(lang).catalog
  return <section className="section application-section" id="prihlaska" aria-labelledby="application-title"><div className="container application-layout"><SectionHeading eyebrow={copy.eyebrow} title={copy.title} text={course ? copy.courseIntro : copy.intro} id="application-title" /><div className="application-action"><div className="button-row">{course ? <ApplyButton courseTitle={course.title} lang={lang} variant="bottom" /> : <><Link className="button button-primary" href={getRoutePath(lang, "courses")}>{catalog.choose}<ArrowUpRight aria-hidden="true" /></Link><Link className="text-link" href={getRoutePath(lang, "contact")}>{catalog.help}<ArrowUpRight aria-hidden="true" /></Link></>}</div><p className="fine-print">{copy.note}</p></div></div></section>
}

export function CourseRail({ course, lang }: { course: Course; lang: Language }) {
  const copy = getSiteCopy(lang).course
  const session = getUpcomingSessions(course.sessions)[0]
  return <div className="course-rail"><div className="container course-rail-inner"><div className="course-rail-title"><span className="course-rail-label">{session ? copy.available : copy.pending}</span><strong className="rail-title">{course.title}</strong></div><div className="course-rail-date"><span className="course-rail-label">{copy.next}</span><strong>{session ? <time dateTime={session.start}>{formatCourseDate(session.start, lang)}</time> : copy.noDate}</strong></div>{(course.formatLabel || course.form) && <div className="course-rail-format"><span className="course-rail-label">{copy.format}</span><strong>{course.formatLabel || course.form}</strong></div>}<Link className="icon-button" href={getDetailRoutePath(lang, "courses", course.slug)} aria-label={`${copy.details}: ${course.title}`} title={copy.details}><ArrowRight aria-hidden="true" /></Link></div></div>
}
import Link from "next/link"
import { ArrowUpRight, Braces, ShieldCheck } from "lucide-react"
import type { Course } from "@/types/course"
import { isValidLanguage } from "@/i18n/config"
import { getSiteCopy } from "@/i18n/site"
import { getDetailRoutePath } from "@/lib/routes"
import { getUpcomingSessions } from "@/lib/course-schedule"
import { CourseFacts, CoursePrice } from "../../components/CourseSections"

interface CourseCardProps {
  course: Course
  lang: string
}

export default function CourseCard({ course, lang }: CourseCardProps) {
  const language = isValidLanguage(lang) ? lang : "cs"
  const copy = getSiteCopy(language)
  const preparing = course.status === "upcoming"
  const hasDates = getUpcomingSessions(course.sessions).length > 0

  return (
    <article className={`catalog-card${preparing ? " catalog-card-planned" : ""}`} data-course-slug={course.slug}>
      <div className="catalog-card-top">
        <span className="catalog-topic">{course.topics?.[0] || <Braces aria-hidden="true" />}</span>
        <span className={`tag${preparing ? "" : " tag-blue"}`}>{preparing ? copy.catalog.planned : hasDates ? copy.course.available : copy.course.pending}</span>
      </div>
      <h3>{course.title}</h3>
      <p className="catalog-description">{course.summary || course.description}</p>
      <div className="catalog-card-support">
        {course.topics && <ul className="catalog-topics">{course.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>}
        {course.accreditation && <p className="catalog-accreditation"><ShieldCheck aria-hidden="true" />{course.accreditation}</p>}
      </div>
      {!preparing && (
        <>
          <div className="catalog-card-details"><CourseFacts course={course} lang={language} /></div>
          <div className="catalog-card-footer">
            <CoursePrice course={course} lang={language} />
            <Link className="button button-primary" href={getDetailRoutePath(language, "courses", course.slug)} aria-label={`${copy.course.details}: ${course.title}`}>
              {copy.course.details}<ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </article>
  )
}

export function CourseGrid({ courses, lang }: { courses: Course[]; lang: string }) {
  const planned = courses.length > 0 && courses.every(course => course.status === "upcoming")
  return <div className={`course-grid${courses.length === 1 ? " course-grid-single" : courses.length === 2 ? " course-grid-pair" : ""}${planned ? " course-grid-planned" : ""}`}>{courses.map(course => <CourseCard course={course} lang={lang} key={course.slug} />)}</div>
}
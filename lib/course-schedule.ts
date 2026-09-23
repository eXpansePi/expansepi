import type { CourseSession } from "@/types/course"

export const FEATURED_COURSE_SLUG = "programator-www-aplikaci-v-pythonu"

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function getUpcomingSessions(
  sessions: readonly CourseSession[] = [],
  now = new Date(),
): CourseSession[] {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)

  return sessions
    .filter(session => isValidDate(session.start) && isValidDate(session.end)
      && session.end >= session.start && session.start >= today)
    .toSorted((first, second) => first.start.localeCompare(second.start))
}

export function formatCourseDate(value: string, lang: string): string {
  return new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : lang === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Prague",
  }).format(new Date(`${value}T12:00:00Z`))
}
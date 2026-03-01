/**
 * Course data access layer
 * @module data/courses
 */

import coursesData from './courses.json'
import { Course, CourseStatus } from '@/types/course'


const cache: Record<string, Course[]> = {}

/**
 * Normalize level values to standard CourseLevel type
 * Maps various level representations (singular, English, Russian) to standard plural Czech values
 */
function normalizeLevel(level: string): Course['level'] {
  const normalized = level.toLowerCase().trim()

  // Beginner levels
  if (normalized === 'začátečník' || normalized === 'beginner' || normalized === 'начальный') {
    return 'Začátečníci'
  }

  // Intermediate levels
  if (normalized === 'středně pokročilí' || normalized === 'intermediate' || normalized === 'средний') {
    return 'Středně pokročilí'
  }

  // Advanced levels
  if (normalized === 'pokročilí' || normalized === 'advanced' || normalized === 'продвинутый') {
    return 'Pokročilí'
  }

  // Fallback: if it matches one of the standard values (case-insensitive), return it
  const standardLevels: Course['level'][] = ['Začátečníci', 'Středně pokročilí', 'Pokročilí']
  const matched = standardLevels.find(l => l.toLowerCase() === normalized)
  if (matched) return matched

  // Default fallback to beginner
  return 'Začátečníci'
}

/**
 * Normalize course data to Course interface (handles both old and multilingual structures)
 */
function normalizeCourse(course: unknown, lang: string = 'cs'): Course | null {
  // Validate basic course structure
  if (!course || typeof course !== 'object') return null
  const obj = course as Record<string, unknown>
  if (typeof obj.slug !== 'string' || !(obj.status === 'active' || obj.status === 'upcoming')) {
    return null
  }

  // Check for multilingual structure first
  if ('languages' in obj && typeof obj.languages === 'object' && obj.languages !== null) {
    const langs = obj.languages as Record<string, unknown>
    const langData = langs[lang] ?? langs['cs'] ?? langs['en'] ?? langs['ru'] ?? Object.values(langs)[0]

    if (langData && typeof langData === 'object') {
      const ld = langData as Record<string, unknown>
      if (
        typeof ld.title === 'string' &&
        typeof ld.description === 'string' &&
        typeof ld.duration === 'string' &&
        typeof ld.level === 'string'
      ) {
        return {
          slug: obj.slug as string,
          title: ld.title,
          description: ld.description,
          duration: ld.duration,
          level: normalizeLevel(ld.level),
          status: obj.status as Course['status'],
          accreditation: typeof ld.accreditation === 'string' ? ld.accreditation : undefined,
          syllabus: Array.isArray(ld.syllabus) ? (ld.syllabus as string[]) : undefined,
          image: typeof ld.image === 'string' ? ld.image : undefined,
          funding: typeof ld.funding === 'string' ? ld.funding : undefined,
        }
      }
    }
  }

  // Handle old (flat) structure
  if (
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.duration === 'string' &&
    typeof obj.level === 'string'
  ) {
    return {
      slug: obj.slug as string,
      title: obj.title,
      description: obj.description,
      duration: obj.duration,
      level: normalizeLevel(obj.level),
      status: obj.status as Course['status'],
      accreditation: typeof obj.accreditation === 'string' ? obj.accreditation : undefined,
      syllabus: Array.isArray(obj.syllabus) ? (obj.syllabus as string[]) : undefined,
      image: typeof obj.image === 'string' ? obj.image : undefined,
    }
  }

  return null
}

/**
 * Get all courses with validation and caching
 * @param lang - Language code for multilingual courses (defaults to 'cs')
 * @returns Array of validated courses
 * @throws Error if courses.json is malformed
 */
export function getAllCourses(lang: string = 'cs'): Course[] {
  if (cache[lang]) return cache[lang]

  const arr: unknown[] = Array.isArray(coursesData) ? coursesData : []
  if (!Array.isArray(coursesData)) {
    throw new Error('courses.json must be an array')
  }

  const validated: Course[] = arr
    .map(course => normalizeCourse(course, lang))
    .filter((course): course is Course => course !== null)

  if (validated.length !== arr.length) {
    console.warn(
      `Warning: ${arr.length - validated.length} invalid course(s) filtered out`
    )
  }

  cache[lang] = validated
  return validated
}

/**
 * Get courses filtered by status
 * @param status - Course status to filter by
 * @param lang - Language code for multilingual courses (defaults to 'cs')
 * @returns Filtered courses array
 */
export function getCoursesByStatus(status: CourseStatus, lang: string = 'cs'): Course[] {
  return getAllCourses(lang).filter(c => c.status === status)
}

/**
 * Get active (available) courses
 * @param lang - Language code for multilingual courses (defaults to 'cs')
 * @returns Active courses array
 */
export function getActiveCourses(lang: string = 'cs'): Course[] {
  return getCoursesByStatus('active', lang)
}

/**
 * Get upcoming (in preparation) courses
 * @param lang - Language code for multilingual courses (defaults to 'cs')
 * @returns Upcoming courses array
 */
export function getUpcomingCourses(lang: string = 'cs'): Course[] {
  return getCoursesByStatus('upcoming', lang)
}

/**
 * Find a single course by slug
 * @param slug - URL-friendly course identifier
 * @param lang - Language code for multilingual courses (defaults to 'cs')
 * @returns Course object or undefined if not found
 */
export function getCourseBySlug(slug: string, lang: string = 'cs'): Course | undefined {
  return getAllCourses(lang).find(c => c.slug === slug)
}

/**
 * Check if a course is active (available for enrollment)
 * @param course - Course object to check
 * @returns True if course is active
 */
export function isActiveCourse(course: Course): boolean {
  return course.status === 'active'
}

/**
 * Check if a course is upcoming (in preparation)
 * @param course - Course object to check
 * @returns True if course is upcoming
 */
export function isUpcomingCourse(course: Course): boolean {
  return course.status === 'upcoming'
}

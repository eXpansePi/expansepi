/**
 * Course data access layer
 * @module data/courses
 */

import coursesData from './courses.json'
import { Course, CourseStatus } from '@/types/course'

/**
 * Type guard to validate course object structure (supports both old and multilingual structures)
 */
function isCourse(obj: any): obj is Course {
  if (!obj || typeof obj.slug !== 'string' || !(obj.status === 'active' || obj.status === 'upcoming')) {
    return false
  }

  // Check for multilingual structure
  if (obj.languages && typeof obj.languages === 'object') {
    // Validate that at least one language exists
    const hasValidLanguage = Object.values(obj.languages).some((langData: any) => 
      langData && 
      typeof langData.title === 'string' &&
      typeof langData.description === 'string' &&
      typeof langData.duration === 'string' &&
      typeof langData.level === 'string'
    )
    return hasValidLanguage
  }

  // Check for old structure
  return (
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.duration === 'string' &&
    typeof obj.level === 'string' &&
    (obj.image === undefined || typeof obj.image === 'string') &&
    (obj.accreditation === undefined || typeof obj.accreditation === 'string')
  )
}

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
function normalizeCourse(course: any, lang: string = 'cs'): Course | null {
  // Validate basic course structure
  if (!course || typeof course !== 'object' || typeof course.slug !== 'string' || !(course.status === 'active' || course.status === 'upcoming')) {
    return null
  }

  // Check for multilingual structure first (before type guard narrows the type)
  if ('languages' in course && typeof course.languages === 'object') {
    // Try requested language first, then fallback to available languages
    const langData = course.languages[lang] || 
                     course.languages['cs'] || 
                     course.languages['en'] || 
                     course.languages['ru'] ||
                     Object.values(course.languages)[0]
    
    if (langData && typeof langData === 'object' && 
        typeof langData.title === 'string' &&
        typeof langData.description === 'string' &&
        typeof langData.duration === 'string' &&
        typeof langData.level === 'string') {
      return {
        slug: course.slug,
        title: langData.title,
        description: langData.description,
        duration: langData.duration,
        level: normalizeLevel(langData.level),
        status: course.status,
        accreditation: langData.accreditation,
        syllabus: langData.syllabus,
        image: langData.image,
        funding: langData.funding,
      }
    }
  }

  // Handle old structure (fallback to default language if multilingual not available)
  if (typeof course.title === 'string' && 
      typeof course.description === 'string' &&
      typeof course.duration === 'string' &&
      typeof course.level === 'string') {
    return {
      slug: course.slug,
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: normalizeLevel(course.level),
      status: course.status,
      accreditation: course.accreditation,
      syllabus: course.syllabus,
      image: course.image,
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
  
  const arr = coursesData as any
  if (!Array.isArray(arr)) {
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

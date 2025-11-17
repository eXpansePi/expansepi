/**
 * Course data model types
 * @module types/course
 */

/**
 * Course availability status
 * - active: Course is available and can be enrolled
 * - upcoming: Course is being prepared, not yet available
 */
export type CourseStatus = 'active' | 'upcoming'

/**
 * Course difficulty level
 */
export type CourseLevel = 'Začátečníci' | 'Středně pokročilí' | 'Pokročilí'

/**
 * Complete course data structure
 */
export interface Course {
  /** Unique URL-friendly identifier */
  slug: string
  
  /** Course display title */
  title: string
  
  /** Short course description */
  description: string
  
  /** Course duration (e.g., "8 týdnů") */
  duration: string
  
  /** Target audience level */
  level: CourseLevel
  
  /** Current availability status */
  status: CourseStatus
  
  /** Optional detailed syllabus (for active courses) */
  syllabus?: string[]
  
  /** Optional start date (for active courses) */
  startDate?: string
  
  /** Optional price (for active courses) */
  price?: number
  
  /** Optional course image/logo URL */
  image?: string
  
  /** Optional accreditation information */
  accreditation?: string
  
  /** Optional funding information */
  funding?: string
}

/**
 * Course filtering and grouping utilities
 */
export interface CourseFilters {
  status?: CourseStatus
  level?: CourseLevel
}

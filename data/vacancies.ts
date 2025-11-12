/**
 * Vacancies data access layer
 * @module data/vacancies
 */

import vacanciesData from './vacancies.json'
import { Vacancy, JobStatus } from '@/types/vacancy'

/**
 * Type guard to validate vacancy object structure (supports both old and multilingual structures)
 */
function isVacancy(obj: any): obj is Vacancy {
  if (!obj || typeof obj.slug !== 'string' || !(obj.status === 'open' || obj.status === 'draft' || obj.status === 'closed')) {
    return false
  }

  // Check for multilingual structure
  if (obj.languages && typeof obj.languages === 'object') {
    // Validate that at least one language exists
    const hasValidLanguage = Object.values(obj.languages).some((langData: any) => 
      langData && 
      typeof langData.title === 'string' &&
      typeof langData.description === 'string' &&
      typeof langData.location === 'string'
    )
    return hasValidLanguage
  }

  // Check for old structure
  return (
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.workMode === 'string' &&
    typeof obj.employmentType === 'string' &&
    typeof obj.postedAt === 'string'
  )
}

const cache: Record<string, Vacancy[]> = {}

/**
 * Normalize vacancy data to Vacancy interface (handles both old and multilingual structures)
 */
function normalizeVacancy(vacancy: any, lang: string = 'cs'): Vacancy | null {
  // Validate basic vacancy structure
  if (!vacancy || typeof vacancy !== 'object' || typeof vacancy.slug !== 'string' || !(vacancy.status === 'open' || vacancy.status === 'draft' || vacancy.status === 'closed')) {
    return null
  }

  // Check for multilingual structure first
  if ('languages' in vacancy && typeof vacancy.languages === 'object') {
    // Try requested language first, then fallback to available languages
    const langData = vacancy.languages[lang] || 
                     vacancy.languages['cs'] || 
                     vacancy.languages['en'] || 
                     vacancy.languages['ru'] ||
                     Object.values(vacancy.languages)[0]
    
    if (langData && typeof langData === 'object' && 
        typeof langData.title === 'string' &&
        typeof langData.description === 'string' &&
        typeof langData.location === 'string') {
      return {
        slug: vacancy.slug,
        title: langData.title,
        description: langData.description,
        details: langData.details,
        location: langData.location,
        workMode: vacancy.workMode,
        employmentType: vacancy.employmentType,
        department: vacancy.department,
        tags: vacancy.tags,
        status: vacancy.status,
        postedAt: vacancy.postedAt,
        updated: vacancy.updated,
        validThrough: vacancy.validThrough,
      }
    }
  }

  // Handle old structure (fallback to default language if multilingual not available)
  if (typeof vacancy.title === 'string' && 
      typeof vacancy.description === 'string' &&
      typeof vacancy.location === 'string' &&
      typeof vacancy.workMode === 'string' &&
      typeof vacancy.employmentType === 'string' &&
      typeof vacancy.postedAt === 'string') {
    return {
      slug: vacancy.slug,
      title: vacancy.title,
      description: vacancy.description,
      details: vacancy.details,
      location: vacancy.location,
      workMode: vacancy.workMode,
      employmentType: vacancy.employmentType,
      department: vacancy.department,
      tags: vacancy.tags,
      status: vacancy.status,
      postedAt: vacancy.postedAt,
      updated: vacancy.updated,
      validThrough: vacancy.validThrough,
    }
  }

  return null
}

/**
 * Get all vacancies with validation and caching
 * @param lang - Language code for multilingual vacancies (defaults to 'cs')
 * @returns Array of validated vacancies, sorted by postedAt (newest first)
 * @throws Error if vacancies.json is malformed
 */
export function getAllVacancies(lang: string = 'cs'): Vacancy[] {
  if (cache[lang]) return cache[lang]
  
  const arr = vacanciesData as any
  if (!Array.isArray(arr)) {
    throw new Error('vacancies.json must be an array')
  }
  
  const validated: Vacancy[] = arr
    .map(vacancy => normalizeVacancy(vacancy, lang))
    .filter((vacancy): vacancy is Vacancy => vacancy !== null)
  
  if (validated.length !== arr.length) {
    console.warn(
      `Warning: ${arr.length - validated.length} invalid vacancy(ies) filtered out`
    )
  }
  
  // Sort by postedAt (newest first)
  cache[lang] = validated.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
  return cache[lang]
}

/**
 * Get vacancies filtered by status
 * @param status - Job status to filter by
 * @param lang - Language code for multilingual vacancies (defaults to 'cs')
 * @returns Filtered vacancies array
 */
export function getVacanciesByStatus(status: JobStatus, lang: string = 'cs'): Vacancy[] {
  return getAllVacancies(lang).filter(v => v.status === status)
}

/**
 * Get open (available) vacancies
 * @param lang - Language code for multilingual vacancies (defaults to 'cs')
 * @returns Open vacancies array
 */
export function getOpenVacancies(lang: string = 'cs'): Vacancy[] {
  return getVacanciesByStatus('open', lang)
}

/**
 * Get draft vacancies
 * @param lang - Language code for multilingual vacancies (defaults to 'cs')
 * @returns Draft vacancies array
 */
export function getDraftVacancies(lang: string = 'cs'): Vacancy[] {
  return getVacanciesByStatus('draft', lang)
}

/**
 * Get closed vacancies
 * @param lang - Language code for multilingual vacancies (defaults to 'cs')
 * @returns Closed vacancies array
 */
export function getClosedVacancies(lang: string = 'cs'): Vacancy[] {
  return getVacanciesByStatus('closed', lang)
}

/**
 * Find a single vacancy by slug
 * @param slug - URL-friendly vacancy identifier
 * @param lang - Language code for multilingual vacancies (defaults to 'cs')
 * @returns Vacancy object or undefined if not found
 */
export function getVacancyBySlug(slug: string, lang: string = 'cs'): Vacancy | undefined {
  return getAllVacancies(lang).find(v => v.slug === slug)
}

/**
 * Get vacancies filtered by tag
 * @param tag - Tag to filter by
 * @param lang - Language code for multilingual vacancies (defaults to 'cs')
 * @returns Filtered vacancies array
 */
export function getVacanciesByTag(tag: string, lang: string = 'cs'): Vacancy[] {
  return getOpenVacancies(lang).filter(v => v.tags?.includes(tag))
}

/**
 * Get recent open vacancies
 * @param limit - Maximum number of vacancies to return (defaults to 5)
 * @param lang - Language code for multilingual vacancies (defaults to 'cs')
 * @returns Recent open vacancies array
 */
export function getRecentVacancies(limit = 5, lang: string = 'cs'): Vacancy[] {
  return getOpenVacancies(lang).slice(0, limit)
}

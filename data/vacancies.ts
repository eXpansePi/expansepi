/**
 * Vacancies data access layer
 * @module data/vacancies
 */

import vacanciesData from './vacancies.json'
import { Vacancy, JobStatus, WorkMode, EmploymentType } from '@/types/vacancy'

/**
 * Type guard to validate vacancy object structure (supports both old and multilingual structures)
 */
function isVacancy(obj: unknown): obj is Vacancy {
  if (!obj || typeof obj !== 'object') return false
  const o = obj as Record<string, unknown>
  if (typeof o.slug !== 'string' || !(o.status === 'open' || o.status === 'draft' || o.status === 'closed')) {
    return false
  }

  // Check for multilingual structure
  if (o.languages && typeof o.languages === 'object') {
    const langs = o.languages as Record<string, unknown>
    const hasValidLanguage = Object.values(langs).some((langData: unknown) => {
      if (!langData || typeof langData !== 'object') return false
      const ld = langData as Record<string, unknown>
      return typeof ld.title === 'string' && typeof ld.description === 'string' && typeof ld.location === 'string'
    })
    return hasValidLanguage
  }

  // Check for old structure
  return (
    typeof o.title === 'string' &&
    typeof o.description === 'string' &&
    typeof o.location === 'string' &&
    typeof o.workMode === 'string' &&
    typeof o.employmentType === 'string' &&
    typeof o.postedAt === 'string'
  )
}

const cache: Record<string, Vacancy[]> = {}

/**
 * Normalize vacancy data to Vacancy interface (handles both old and multilingual structures)
 */
function normalizeVacancy(vacancy: unknown, lang: string = 'cs'): Vacancy | null {
  if (!vacancy || typeof vacancy !== 'object') return null
  const v = vacancy as Record<string, unknown>
  if (typeof v.slug !== 'string' || !(v.status === 'open' || v.status === 'draft' || v.status === 'closed')) {
    return null
  }

  // Check for multilingual structure first
  if ('languages' in v && typeof v.languages === 'object' && v.languages !== null) {
    const langs = v.languages as Record<string, unknown>
    const langData = (langs[lang] || langs['cs'] || langs['en'] || langs['ru'] || Object.values(langs)[0]) as Record<string, unknown> | undefined
    
    if (langData && typeof langData === 'object' && 
        typeof langData.title === 'string' &&
        typeof langData.description === 'string' &&
        typeof langData.location === 'string') {
      return {
        slug: v.slug as string,
        title: langData.title,
        description: langData.description,
        details: typeof langData.details === 'string' ? langData.details : undefined,
        location: langData.location,
        workMode: v.workMode as WorkMode,
        employmentType: v.employmentType as EmploymentType,
        department: typeof v.department === 'string' ? v.department : undefined,
        tags: Array.isArray(v.tags) ? v.tags as string[] : undefined,
        status: v.status as Vacancy['status'],
        postedAt: v.postedAt as string,
        updated: typeof v.updated === 'string' ? v.updated : undefined,
        validThrough: typeof v.validThrough === 'string' ? v.validThrough : undefined,
      }
    }
  }

  // Handle old structure (fallback)
  if (typeof v.title === 'string' && 
      typeof v.description === 'string' &&
      typeof v.location === 'string' &&
      typeof v.workMode === 'string' &&
      typeof v.employmentType === 'string' &&
      typeof v.postedAt === 'string') {
    return {
      slug: v.slug as string,
      title: v.title,
      description: v.description,
      details: typeof v.details === 'string' ? v.details : undefined,
      location: v.location,
      workMode: v.workMode as WorkMode,
      employmentType: v.employmentType as EmploymentType,
      department: typeof v.department === 'string' ? v.department : undefined,
      tags: Array.isArray(v.tags) ? v.tags as string[] : undefined,
      status: v.status as Vacancy['status'],
      postedAt: v.postedAt,
      updated: typeof v.updated === 'string' ? v.updated : undefined,
      validThrough: typeof v.validThrough === 'string' ? v.validThrough : undefined,
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
  
  const arr: unknown[] = Array.isArray(vacanciesData) ? vacanciesData : []
  if (!Array.isArray(vacanciesData)) {
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

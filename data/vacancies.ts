/**
 * Vacancies data access layer
 */
import rawVacancies from './vacancies.json'
import { Vacancy, JobStatus } from '@/types/vacancy'

function isVacancy(obj: any): obj is Vacancy {
  return (
    obj &&
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.workMode === 'string' &&
    typeof obj.employmentType === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.postedAt === 'string'
  )
}

let cache: Vacancy[] | null = null

export function getAllVacancies(): Vacancy[] {
  if (cache) return cache
  const arr = rawVacancies as any
  if (!Array.isArray(arr)) throw new Error('vacancies.json must be an array')
  const validated = arr.filter(isVacancy)
  if (validated.length !== arr.length) {
    console.warn(`Warning: ${arr.length - validated.length} invalid vacancy(ies) filtered out`)
  }
  // newest first
  cache = validated.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
  return cache
}

export function getVacanciesByStatus(status: JobStatus): Vacancy[] {
  return getAllVacancies().filter(v => v.status === status)
}

export function getOpenVacancies(): Vacancy[] {
  return getVacanciesByStatus('open')
}

export function getDraftVacancies(): Vacancy[] {
  return getVacanciesByStatus('draft')
}

export function getClosedVacancies(): Vacancy[] {
  return getVacanciesByStatus('closed')
}

export function getVacancyBySlug(slug: string): Vacancy | undefined {
  return getAllVacancies().find(v => v.slug === slug)
}

export function getVacanciesByTag(tag: string): Vacancy[] {
  return getOpenVacancies().filter(v => v.tags?.includes(tag))
}

export function getRecentVacancies(limit = 5): Vacancy[] {
  return getOpenVacancies().slice(0, limit)
}

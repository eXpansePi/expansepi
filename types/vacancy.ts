/**
 * Vacancy (job posting) related TypeScript types
 */

export type JobStatus = 'open' | 'draft' | 'closed'
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'
export type WorkMode = 'onsite' | 'remote' | 'hybrid'

export interface Vacancy {
  slug: string
  title: string
  description: string // short listing description
  details?: string // long description / markdown
  location: string // e.g., "Praha / Remote"
  workMode: WorkMode
  employmentType: EmploymentType
  department?: string
  tags?: string[]
  status: JobStatus
  postedAt: string // ISO date
  updated?: string // ISO date
  validThrough?: string // ISO date when job expires
}

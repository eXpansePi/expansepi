/**
 * Team member and lecturer data access layer
 * @module data/team
 */

import teamData from './team.json'
import { TeamMember, Lecturer } from '@/types/team'

/**
 * Normalize team member data to TeamMember interface (handles both old and multilingual structures)
 */
function normalizeTeamMember(member: unknown, lang: string = 'cs'): TeamMember | null {
  if (!member || typeof member !== 'object') return null
  const m = member as Record<string, unknown>
  // Handle both string and number IDs (convert number to string)
  const id = typeof m.id === 'string' ? m.id : String(m.id)
  
  if (typeof m.name !== 'string' || typeof m.title !== 'string' ||
      !(m.role === 'founder' || m.role === 'hr' || m.role === 'other')) {
    return null
  }

  // Check for multilingual structure
  if ('languages' in m && typeof m.languages === 'object' && m.languages !== null) {
    const langs = m.languages as Record<string, unknown>
    const langData = (langs[lang] || langs['cs'] || langs['en'] || langs['ru'] || Object.values(langs)[0]) as Record<string, unknown> | undefined
    
    if (langData && typeof langData === 'object') {
      // Handle empty photo string as undefined
      const photo = typeof m.photo === 'string' && m.photo.trim() !== '' ? m.photo : undefined
      
      return {
        id: id,
        name: m.name,
        title: m.title,
        description: typeof langData.description === 'string' ? langData.description : '',
        specializations: Array.isArray(langData.specializations) ? langData.specializations as string[] : (Array.isArray(m.specializations) ? m.specializations as string[] : []),
        photo: photo,
        role: m.role as TeamMember['role']
      }
    }
  }

  // Handle old structure (fallback)
  const photo = typeof m.photo === 'string' && m.photo.trim() !== '' ? m.photo : undefined
  
  return {
    id: id,
    name: m.name,
    title: m.title,
    description: typeof m.description === 'string' ? m.description : '',
    specializations: Array.isArray(m.specializations) ? m.specializations as string[] : [],
    photo: photo,
    role: m.role as TeamMember['role']
  }
}

/**
 * Normalize lecturer data to Lecturer interface (handles both old and multilingual structures)
 */
function normalizeLecturer(lecturer: unknown, lang: string = 'cs'): Lecturer | null {
  if (!lecturer || typeof lecturer !== 'object') return null
  const l = lecturer as Record<string, unknown>
  // Handle both string and number IDs (convert number to string)
  const id = typeof l.id === 'string' ? l.id : String(l.id)
  
  if (typeof l.name !== 'string' || typeof l.title !== 'string') {
    return null
  }

  // Check for multilingual structure
  if ('languages' in l && typeof l.languages === 'object' && l.languages !== null) {
    const langs = l.languages as Record<string, unknown>
    const langData = (langs[lang] || langs['cs'] || langs['en'] || langs['ru'] || Object.values(langs)[0]) as Record<string, unknown> | undefined
    
    if (langData && typeof langData === 'object' && typeof langData.description === 'string') {
      const photo = typeof l.photo === 'string' && l.photo.trim() !== '' ? l.photo : undefined
      
      return {
        id: id,
        name: l.name,
        title: l.title,
        description: langData.description,
        specializations: Array.isArray(langData.specializations) ? langData.specializations as string[] : (Array.isArray(l.specializations) ? l.specializations as string[] : []),
        photo: photo
      }
    }
  }

  // Handle old structure (fallback)
  if (typeof l.description === 'string') {
    const photo = typeof l.photo === 'string' && l.photo.trim() !== '' ? l.photo : undefined
    
    return {
      id: id,
      name: l.name,
      title: l.title,
      description: l.description,
      specializations: Array.isArray(l.specializations) ? l.specializations as string[] : [],
      photo: photo
    }
  }

  return null
}

const teamMembersCache: Record<string, TeamMember[]> = {}
const lecturersCache: Record<string, Lecturer[]> = {}

/**
 * Get all team members
 * @param lang - Language code for multilingual descriptions (defaults to 'cs')
 * @returns Array of validated team members
 */
export function getAllTeamMembers(lang: string = 'cs'): TeamMember[] {
  if (teamMembersCache[lang]) {
    return teamMembersCache[lang]
  }

  const data = teamData as Record<string, unknown>
  const arr = data.teamMembers
  if (!Array.isArray(arr)) {
    return []
  }
  
  const validated: TeamMember[] = (arr as unknown[])
    .map(member => normalizeTeamMember(member, lang))
    .filter((member): member is TeamMember => member !== null)
  
  teamMembersCache[lang] = validated
  return validated
}

/**
 * Get all lecturers
 * @param lang - Language code for multilingual descriptions (defaults to 'cs')
 * @returns Array of validated lecturers
 */
export function getAllLecturers(lang: string = 'cs'): Lecturer[] {
  if (lecturersCache[lang]) {
    return lecturersCache[lang]
  }

  const data = teamData as Record<string, unknown>
  const arr = data.lecturers
  if (!Array.isArray(arr)) {
    return []
  }
  
  const validated: Lecturer[] = (arr as unknown[])
    .map(lecturer => normalizeLecturer(lecturer, lang))
    .filter((lecturer): lecturer is Lecturer => lecturer !== null)
  
  lecturersCache[lang] = validated
  return validated
}

/**
 * Get team members by role
 * @param role - Team member role to filter by
 * @param lang - Language code for multilingual descriptions (defaults to 'cs')
 * @returns Filtered team members array
 */
export function getTeamMembersByRole(role: TeamMember['role'], lang: string = 'cs'): TeamMember[] {
  return getAllTeamMembers(lang).filter(m => m.role === role)
}


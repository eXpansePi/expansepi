/**
 * Team member and lecturer data access layer
 * @module data/team
 */

import teamData from './team.json'
import { TeamMember, Lecturer } from '@/types/team'

/**
 * Normalize team member data to TeamMember interface (handles both old and multilingual structures)
 */
function normalizeTeamMember(member: any, lang: string = 'cs'): TeamMember | null {
  // Handle both string and number IDs (convert number to string)
  const id = typeof member.id === 'string' ? member.id : String(member.id)
  
  if (!member || typeof member !== 'object' || 
      typeof member.name !== 'string' || typeof member.title !== 'string' ||
      !(member.role === 'founder' || member.role === 'hr' || member.role === 'other')) {
    return null
  }

  // Check for multilingual structure
  if ('languages' in member && typeof member.languages === 'object') {
    const langData = member.languages[lang] || 
                     member.languages['cs'] || 
                     member.languages['en'] || 
                     member.languages['ru'] ||
                     Object.values(member.languages)[0]
    
    if (langData && typeof langData === 'object') {
      // Handle empty photo string as undefined
      const photo = member.photo && member.photo.trim() !== '' ? member.photo : undefined
      
      return {
        id: id,
        name: member.name,
        title: member.title,
        description: langData.description,
        specializations: langData.specializations || member.specializations,
        photo: photo,
        role: member.role
      }
    }
  }

  // Handle old structure (fallback to default language if multilingual not available)
  // Handle empty photo string as undefined
  const photo = member.photo && member.photo.trim() !== '' ? member.photo : undefined
  
  return {
    id: id,
    name: member.name,
    title: member.title,
    description: member.description,
    specializations: member.specializations,
    photo: photo,
    role: member.role
  }
}

/**
 * Normalize lecturer data to Lecturer interface (handles both old and multilingual structures)
 */
function normalizeLecturer(lecturer: any, lang: string = 'cs'): Lecturer | null {
  // Handle both string and number IDs (convert number to string)
  const id = typeof lecturer.id === 'string' ? lecturer.id : String(lecturer.id)
  
  if (!lecturer || typeof lecturer !== 'object' || 
      typeof lecturer.name !== 'string' || typeof lecturer.title !== 'string') {
    return null
  }

  // Check for multilingual structure
  if ('languages' in lecturer && typeof lecturer.languages === 'object') {
    const langData = lecturer.languages[lang] || 
                     lecturer.languages['cs'] || 
                     lecturer.languages['en'] || 
                     lecturer.languages['ru'] ||
                     Object.values(lecturer.languages)[0]
    
    if (langData && typeof langData === 'object' && typeof langData.description === 'string') {
      // Handle empty photo string as undefined
      const photo = lecturer.photo && lecturer.photo.trim() !== '' ? lecturer.photo : undefined
      
      return {
        id: id,
        name: lecturer.name,
        title: lecturer.title,
        description: langData.description,
        specializations: langData.specializations || lecturer.specializations,
        photo: photo
      }
    }
  }

  // Handle old structure (fallback to default language if multilingual not available)
  if (typeof lecturer.description === 'string') {
    // Handle empty photo string as undefined
    const photo = lecturer.photo && lecturer.photo.trim() !== '' ? lecturer.photo : undefined
    
    return {
      id: id,
      name: lecturer.name,
      title: lecturer.title,
      description: lecturer.description,
      specializations: lecturer.specializations,
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

  const arr = (teamData as any).teamMembers
  if (!Array.isArray(arr)) {
    return []
  }
  
  const validated: TeamMember[] = arr
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

  const arr = (teamData as any).lecturers
  if (!Array.isArray(arr)) {
    return []
  }
  
  const validated: Lecturer[] = arr
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


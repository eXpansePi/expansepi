/**
 * Team member and lecturer data model types
 * @module types/team
 */

/**
 * Team member role type
 */
export type TeamMemberRole = 'founder' | 'hr' | 'other'

/**
 * Team member data structure
 */
export interface TeamMember {
  /** Unique identifier */
  id: string
  
  /** Person's name */
  name: string
  
  /** Person's title/position */
  title: string
  
  /** Optional description (localized) */
  description?: string
  
  /** Optional specializations (localized) */
  specializations?: string[]
  
  /** Optional photo URL */
  photo?: string
  
  /** Role in the organization */
  role: TeamMemberRole
}

/**
 * Lecturer data structure
 */
export interface Lecturer {
  /** Unique identifier */
  id: string
  
  /** Lecturer's name */
  name: string
  
  /** Lecturer's title/position */
  title: string
  
  /** Lecturer's description (localized) */
  description: string
  
  /** Optional specializations (localized) */
  specializations?: string[]
  
  /** Optional photo URL */
  photo?: string
}


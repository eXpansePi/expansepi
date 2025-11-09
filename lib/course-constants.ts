/**
 * Course-related constants and configuration
 * @module lib/course-constants
 */

import { CourseStatus, CourseLevel } from '@/types/course'

/**
 * Status configuration for visual representation
 */
export const COURSE_STATUS_CONFIG = {
  active: {
    label: 'Probíhá',
    badgeClass: 'bg-green-100 text-green-800 border-green-300',
    cardClass: 'border-green-200 bg-gradient-to-br from-white to-green-50',
    icon: '✓',
    description: 'Kurz je dostupný k zápisu'
  },
  upcoming: {
    label: 'Připravujeme',
    badgeClass: 'bg-gray-100 text-gray-600 border-gray-300',
    cardClass: 'border-gray-200 bg-gradient-to-br from-white to-gray-50 opacity-90',
    icon: '⏳',
    description: 'Kurz je ve vývoji'
  }
} as const

/**
 * Level configuration for visual representation
 */
export const COURSE_LEVEL_CONFIG = {
  'Začátečníci': {
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-700'
  },
  'Středně pokročilí': {
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-700'
  },
  'Pokročilí': {
    color: 'orange',
    badgeClass: 'bg-orange-100 text-orange-700'
  }
} as const

/**
 * Helper to get status config safely
 */
export const getStatusConfig = (status: CourseStatus) => COURSE_STATUS_CONFIG[status]

/**
 * Helper to get level config safely
 */
export const getLevelConfig = (level: CourseLevel) => COURSE_LEVEL_CONFIG[level]

/**
 * i18n configuration
 */

export const languages = ['cs', 'en', 'ru'] as const
export const defaultLanguage = 'cs'

export type Language = (typeof languages)[number]

export function isValidLanguage(lang: unknown): lang is Language {
  return languages.includes(lang as Language)
}

export const langLabels: Record<Language, string> = {
  cs: 'Čeština',
  en: 'English',
  ru: 'Русский'
}

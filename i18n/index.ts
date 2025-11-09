/**
 * Translation loader and hook
 */

import { Language, isValidLanguage, defaultLanguage } from './config'

export type Translations = typeof import('./locales/cs.json')

const locales: Record<Language, Translations> = {
  cs: require('./locales/cs.json'),
  en: require('./locales/en.json'),
  ru: require('./locales/ru.json')
}

export function getTranslations(lang: string): Translations {
  if (!isValidLanguage(lang)) {
    return locales[defaultLanguage]
  }
  return locales[lang]
}

export function useTranslation(lang: string) {
  const t = getTranslations(lang)
  return { t }
}

/**
 * Translation loader and hook
 */

import { Language, isValidLanguage, defaultLanguage } from './config'
import cs from './locales/cs.json'
import en from './locales/en.json'
import ru from './locales/ru.json'

export type Translations = typeof cs

const locales: Record<Language, Translations> = { cs, en, ru }

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

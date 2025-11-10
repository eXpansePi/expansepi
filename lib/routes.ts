/**
 * Language-specific route mapping for SEO-friendly URLs
 * Maps language codes to URL slugs for proper multilingual URL structure
 */

import { Language } from '@/i18n/config'

export type RouteKey = 'courses' | 'blog' | 'vacancies' | 'about' | 'contact' | 'home'

/**
 * Route mapping: language -> route key -> URL slug
 */
const routeMap: Record<Language, Record<RouteKey, string>> = {
  cs: {
    courses: 'kurzy',
    blog: 'blog',
    vacancies: 'volne-pozice',
    about: 'o-nas',
    contact: 'kontakt',
    home: 'domu',
  },
  en: {
    courses: 'courses',
    blog: 'blog',
    vacancies: 'vacancies',
    about: 'about',
    contact: 'contact',
    home: 'home',
  },
  ru: {
    courses: 'kursy',
    blog: 'blog',
    vacancies: 'vakansii',
    about: 'o-nas',
    contact: 'kontakt',
    home: 'glavnaya',
  },
}

/**
 * Internal route mapping (used for file system routing)
 * Maps language-specific slugs back to internal route structure
 */
const internalRouteMap: Record<string, RouteKey> = {
  // Czech routes
  'kurzy': 'courses',
  'blog': 'blog',
  'volne-pozice': 'vacancies',
  'o-nas': 'about',
  'kontakt': 'contact',
  'domu': 'home',
  // English routes
  'courses': 'courses',
  'vacancies': 'vacancies',
  'about': 'about',
  'contact': 'contact',
  'home': 'home',
  // Russian routes
  'kursy': 'courses',
  'vakansii': 'vacancies',
  'glavnaya': 'home',
}

/**
 * Get language-specific URL slug for a route
 */
export function getRoute(lang: Language, routeKey: RouteKey): string {
  return routeMap[lang][routeKey]
}

/**
 * Get full URL path for a route
 */
export function getRoutePath(lang: Language, routeKey: RouteKey): string {
  return `/${lang}/${getRoute(lang, routeKey)}`
}

/**
 * Get all language-specific URLs for a route (for hreflang)
 */
export function getAllRoutePaths(routeKey: RouteKey): Record<Language, string> {
  return {
    cs: getRoutePath('cs', routeKey),
    en: getRoutePath('en', routeKey),
    ru: getRoutePath('ru', routeKey),
  }
}

/**
 * Get internal route key from a URL slug
 * Used to map language-specific URLs to internal routes
 */
export function getInternalRoute(slug: string): RouteKey | null {
  return (internalRouteMap[slug] as RouteKey) || null
}

/**
 * Check if a slug is a valid route for any language
 */
export function isValidRoute(slug: string): boolean {
  return slug in internalRouteMap
}

/**
 * Convert an internal route path to language-specific public path
 * This handles the case where usePathname() returns internal routes after rewrites
 */
export function getPublicPath(internalPath: string, targetLang: Language): string {
  // Handle root path (just language code)
  if (/^\/(cs|en|ru)$/.test(internalPath)) {
    return `/${targetLang}`
  }
  
  // Extract language and route segments
  const match = internalPath.match(/\/(cs|en|ru)\/([^/]+)(?:\/(.*))?$/)
  if (!match) {
    // If no match, try to preserve the path structure
    return internalPath.replace(/^\/(cs|en|ru)/, `/${targetLang}`)
  }
  
  const [, currentLang, routeSegment, restOfPath] = match
  const routeKey = getInternalRoute(routeSegment)
  
  if (!routeKey) {
    // If route segment not found in map, try direct replacement
    return internalPath.replace(`/${currentLang}/${routeSegment}`, `/${targetLang}/${routeSegment}`)
  }
  
  // Get the language-specific slug for the target language
  const targetSlug = getRoute(targetLang, routeKey)
  const newPath = restOfPath 
    ? `/${targetLang}/${targetSlug}/${restOfPath}`
    : `/${targetLang}/${targetSlug}`
  
  return newPath
}

/**
 * Get route path for a detail page (e.g., course, blog post, vacancy)
 */
export function getDetailRoutePath(
  lang: Language,
  routeKey: 'courses' | 'blog' | 'vacancies',
  itemSlug: string
): string {
  const baseRoute = getRoute(lang, routeKey)
  return `/${lang}/${baseRoute}/${itemSlug}`
}

/**
 * Get all language-specific URLs for a detail page (for hreflang)
 */
export function getAllDetailRoutePaths(
  routeKey: 'courses' | 'blog' | 'vacancies',
  itemSlug: string
): Record<Language, string> {
  return {
    cs: getDetailRoutePath('cs', routeKey, itemSlug),
    en: getDetailRoutePath('en', routeKey, itemSlug),
    ru: getDetailRoutePath('ru', routeKey, itemSlug),
  }
}


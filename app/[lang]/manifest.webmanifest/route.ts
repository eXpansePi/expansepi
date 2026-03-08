import { NextRequest, NextResponse } from 'next/server'
import { isValidLanguage, defaultLanguage, type Language } from '@/i18n/config'
import { getRoutePath } from '@/lib/routes'

const manifestMeta: Record<Language, { name: string; short_name: string; description: string }> = {
  cs: {
    name: 'eXpansePi - IT vzdělávání',
    short_name: 'eXpansePi',
    description: 'Platforma IT vzdělávání pro každého',
  },
  en: {
    name: 'eXpansePi - IT Education',
    short_name: 'eXpansePi',
    description: 'IT education platform for everyone',
  },
  ru: {
    name: 'eXpansePi - IT образование',
    short_name: 'eXpansePi',
    description: 'Платформа IT-образования для всех',
  },
}

const shortcutLabels: Record<Language, { courses: string; about: string }> = {
  cs: { courses: 'Kurzy', about: 'O nás' },
  en: { courses: 'Courses', about: 'About' },
  ru: { courses: 'Курсы', about: 'О нас' },
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang: rawLang } = await params
  const lang: Language = isValidLanguage(rawLang) ? rawLang : defaultLanguage
  const meta = manifestMeta[lang]
  const labels = shortcutLabels[lang]

  const manifestData = {
    id: `/${lang}`,
    name: meta.name,
    short_name: meta.short_name,
    description: meta.description,
    start_url: `/${lang}`,
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    lang,
    dir: 'ltr',
    categories: ['education', 'technology'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    shortcuts: [
      {
        name: labels.courses,
        url: getRoutePath(lang, 'courses'),
        icons: [{ src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
      },
      {
        name: labels.about,
        url: getRoutePath(lang, 'about'),
        icons: [{ src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
      },
    ],
  }

  return NextResponse.json(manifestData, {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  })
}


import { NextRequest, NextResponse } from 'next/server'
import { languages, defaultLanguage } from '@/i18n/config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip proxy for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/manifest.json' ||
    pathname === '/manifest.webmanifest' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|json|webmanifest|xml|txt)$/)
  ) {
    return NextResponse.next()
  }

  // Skip root path - it's the animated landing page
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Check if path already has language prefix
  const pathnameHasLanguage = languages.some(lang => pathname.startsWith(`/${lang}`))

  if (pathnameHasLanguage) {
    return NextResponse.next()
  }

  // Redirect to default language version
  return NextResponse.redirect(
    new URL(`/${defaultLanguage}${pathname}`, request.url)
  )
}

export const config = {
  matcher: ['/((?!_next|api).*)'],
}


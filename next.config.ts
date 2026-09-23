import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Origins reached only after the visitor accepts analytics and advertising.
 * They stay in the policy because a response header cannot depend on a consent
 * decision that lives in the browser; ConsentedAnalytics is what actually
 * decides whether anything is ever loaded from them.
 */
const GOOGLE_TAG_ORIGINS = [
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://googleads.g.doubleclick.net',
];

/**
 * `script-src` keeps 'unsafe-inline' deliberately.
 *
 * Removing it requires per-request nonces, and Next.js can only apply a nonce
 * while rendering dynamically: nonces disable static generation, ISR and CDN
 * caching for every page (documented at nextjs.org/docs/app/guides/
 * content-security-policy). This site is almost entirely prerendered content,
 * so that trade is not worth making. Hashes are not an alternative either,
 * because Next emits per-page inline bootstrap scripts whose contents differ
 * on every route. Revisit if the site ever handles authenticated sessions.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDevelopment ? "'unsafe-eval' " : ""}${GOOGLE_TAG_ORIGINS.join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://*.doubleclick.net https://www.googleadservices.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://stats.g.doubleclick.net https://ad.doubleclick.net https://pagead2.googlesyndication.com https://www.google.com https://www.googleadservices.com https://*.vercel-insights.com https://*.vercel-analytics.com",
  "frame-src 'self' https://td.doubleclick.net",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  distDir: process.env.NEXT_OUTPUT_DIR || ".next",

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // English routes -> internal routes
      { source: '/en/courses', destination: '/en/kurzy' },
      { source: '/en/courses/:slug*', destination: '/en/kurzy/:slug*' },
      { source: '/en/vacancies', destination: '/en/volne-pozice' },
      { source: '/en/vacancies/:slug*', destination: '/en/volne-pozice/:slug*' },
      { source: '/en/about', destination: '/en/o-nas' },
      { source: '/en/contact', destination: '/en/kontakt' },
      { source: '/en/home', destination: '/en/home' },
      // Russian routes -> internal routes
      { source: '/ru/kursy', destination: '/ru/kurzy' },
      { source: '/ru/kursy/:slug*', destination: '/ru/kurzy/:slug*' },
      { source: '/ru/vakansii', destination: '/ru/volne-pozice' },
      { source: '/ru/vakansii/:slug*', destination: '/ru/volne-pozice/:slug*' },
      { source: '/ru/glavnaya', destination: '/ru/home' },
      // Czech routes -> internal routes (for consistency, though they match)
      { source: '/cs/domu', destination: '/cs/home' },

      // GDPR routes (map localized URLs to internal gdpr route)
      { source: '/cs/ochrana-osobnich-udaju', destination: '/cs/gdpr' },
      { source: '/en/privacy-policy', destination: '/en/gdpr' },
      { source: '/ru/politika-konfidencialnosti', destination: '/ru/gdpr' },
    ];
  },
};

export default nextConfig;

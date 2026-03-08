import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://*.doubleclick.net https://www.googleadservices.com",
              "font-src 'self'",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://www.google.com https://www.googleadservices.com https://*.vercel-insights.com https://*.vercel-analytics.com",
              "frame-src 'self' https://td.doubleclick.net",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
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

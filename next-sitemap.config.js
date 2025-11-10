/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
    ],
    additionalSitemaps: [
      'https://expansepi.com/sitemap.xml',
    ],
  },
  // Note: Next.js 13+ App Router uses sitemap.ts instead
  // This config is for reference and can be used with next-sitemap CLI if needed
}


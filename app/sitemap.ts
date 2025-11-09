import { MetadataRoute } from 'next'
import { languages } from '../i18n/config'
import { getAllCourses } from '../data/courses'
import { getPublishedPosts } from '../data/posts'
import { getOpenVacancies } from '../data/vacancies'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const currentDate = new Date()

  // Static pages for all languages
  const staticEntries: MetadataRoute.Sitemap = languages.flatMap(lang => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/${lang}/home`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/kurzy`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/o-nas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${lang}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${lang}/kontakt`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/${lang}/volne-pozice`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ])

  // Course entries for all languages
  const courseEntries: MetadataRoute.Sitemap = languages.flatMap(lang =>
    getAllCourses(lang)
      .filter(c => c.status === 'active')
      .map(c => ({
        url: `${baseUrl}/${lang}/kurzy/${c.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
  )

  // Blog entries for all languages
  const blogEntries: MetadataRoute.Sitemap = languages.flatMap(lang =>
    getPublishedPosts().map(p => ({
      url: `${baseUrl}/${lang}/blog/${p.slug}`,
      lastModified: p.updated ? new Date(p.updated) : new Date(p.date),
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  )

  // Vacancy entries for all languages
  const vacancyEntries: MetadataRoute.Sitemap = languages.flatMap(lang =>
    getOpenVacancies().map(v => ({
      url: `${baseUrl}/${lang}/volne-pozice/${v.slug}`,
      lastModified: v.updated ? new Date(v.updated) : new Date(v.postedAt),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
  )

  return [...staticEntries, ...courseEntries, ...blogEntries, ...vacancyEntries]
}

import { MetadataRoute } from 'next'
import { languages, type Language } from '../i18n/config'
import { getAllCourses } from '../data/courses'
import { getPublishedPosts } from '../data/posts'
import { getOpenVacancies } from '../data/vacancies'
import { getRoutePath, getDetailRoutePath } from '../lib/routes'

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
      url: `${baseUrl}${getRoutePath(lang as Language, 'home')}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}${getRoutePath(lang as Language, 'courses')}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}${getRoutePath(lang as Language, 'about')}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}${getRoutePath(lang as Language, 'blog')}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}${getRoutePath(lang as Language, 'contact')}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}${getRoutePath(lang as Language, 'vacancies')}`,
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
        url: `${baseUrl}${getDetailRoutePath(lang as Language, 'courses', c.slug)}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
  )

  // Blog entries for all languages
  const blogEntries: MetadataRoute.Sitemap = languages.flatMap(lang =>
    getPublishedPosts().map(p => ({
      url: `${baseUrl}${getDetailRoutePath(lang as Language, 'blog', p.slug)}`,
      lastModified: p.updated ? new Date(p.updated) : new Date(p.date),
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  )

  // Vacancy entries for all languages
  const vacancyEntries: MetadataRoute.Sitemap = languages.flatMap(lang =>
    getOpenVacancies().map(v => ({
      url: `${baseUrl}${getDetailRoutePath(lang as Language, 'vacancies', v.slug)}`,
      lastModified: v.updated ? new Date(v.updated) : new Date(v.postedAt),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
  )

  return [...staticEntries, ...courseEntries, ...blogEntries, ...vacancyEntries]
}

import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getPublishedPosts } from "@/data/posts"
import { BlogCard } from "./components"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"

const localeMap: Record<string, string> = { cs: 'cs_CZ', en: 'en_US', ru: 'ru_RU' }

interface BlogPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const allRoutes = getAllRoutePaths('blog')

  return {
    title: t.blog.title,
    description: t.blog.description,
    alternates: {
      canonical: `${baseUrl}${allRoutes[lang]}`,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`,
        'x-default': `${baseUrl}${allRoutes.cs}`,
      },
    },
    openGraph: {
      title: t.blog.title,
      description: t.blog.description,
      url: `${baseUrl}${allRoutes[lang]}`,
      siteName: 'eXpansePi',
      locale: localeMap[lang],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.blog.title,
      description: t.blog.description,
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const posts = getPublishedPosts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage={getRoutePath(lang, 'blog')} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">{t.blog.title}</h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t.blog.description}</p>

          <div className="space-y-5 sm:space-y-6">
            {posts.map(post => (
              <BlogCard key={post.slug} post={post} lang={lang} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

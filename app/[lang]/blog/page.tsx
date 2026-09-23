import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
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
    <>
      <Navigation activePage={getRoutePath(lang, 'blog')} lang={lang} t={t} />
      <main id="main-content" className="site-main">
        <section className="page-intro"><div className="container"><p className="eyebrow">eXpansePi / {t.common.blog}</p><h1>{t.blog.title}</h1><p className="lead">{t.blog.description}</p></div></section>
        <section className="section" aria-label={t.blog.title}>
          <div className="container editorial-list">
            {posts.map(post => (
              <BlogCard key={post.slug} post={post} lang={lang} />
            ))}
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  )
}

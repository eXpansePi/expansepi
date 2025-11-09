import type { Metadata } from "next"
import Navigation from "../../components/Navigation"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getPublishedPosts, getPostBySlug } from "@/data/posts"
import { getBlogPostingSchema, getBreadcrumbSchema } from "@/lib/seo"

interface BlogDetailProps {
  params: Promise<{ lang: string; slug: string }>
}

export function generateStaticParams() {
  return getPublishedPosts().flatMap(post =>
    ['cs', 'en', 'ru'].map(lang => ({
      lang,
      slug: post.slug
    }))
  )
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const post = getPostBySlug(resolvedParams.slug)

  if (!post || post.status !== 'published') {
    return { title: t.common.notFound }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const postUrl = `${baseUrl}/${lang}/blog/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
      languages: {
        'cs': `${baseUrl}/cs/blog/${post.slug}`,
        'en': `${baseUrl}/en/blog/${post.slug}`,
        'ru': `${baseUrl}/ru/blog/${post.slug}`
      }
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'eXpansePi',
      locale: lang === 'cs' ? 'cs_CZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: post.updated ? new Date(post.updated).toISOString() : new Date(post.date).toISOString(),
      authors: [post.author],
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${baseUrl}/og-image.jpg`],
    }
  }
}

export default async function BlogDetail({ params }: BlogDetailProps) {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const post = getPostBySlug(resolvedParams.slug)

  if (!post || post.status !== 'published') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation activePage={`/${lang}/blog`} lang={lang} t={t} />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t.common.notFound}</h1>
            <a href={`/${lang}/blog`} className="text-blue-600 font-semibold hover:underline">{t.common.backToList}</a>
          </div>
        </main>
      </div>
    )
  }

  const blogSchema = getBlogPostingSchema(post, lang)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t.common.home, url: `https://expansepi.com/${lang}` },
    { name: t.common.blog, url: `https://expansepi.com/${lang}/blog` },
    { name: post.title, url: `https://expansepi.com/${lang}/blog/${post.slug}` },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navigation activePage={`/${lang}/blog`} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{post.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 text-xs sm:text-sm mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-gray-200">
            <span>{new Date(post.date).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : lang === 'ru' ? 'ru-RU' : 'en-US')}</span>
            <span className="hidden sm:inline">•</span>
            <span>{post.author}</span>
          </div>
          <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
            <p className="text-base sm:text-lg leading-relaxed">{post.excerpt}</p>
            {post.content && (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>
          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-200">
            <a href={`/${lang}/blog`} className="text-sm sm:text-base text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2">
              ← {t.common.backToList}
            </a>
          </div>
        </article>
      </main>
    </div>
  )
}

import type { Metadata } from "next"
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import Link from "next/link"
import { notFound } from "next/navigation"
import Markdown from "react-markdown"
import { ArrowLeft } from "lucide-react"
import { JsonLd } from "@/app/components/JsonLd"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getPublishedPosts, getPostBySlug } from "@/data/posts"
import { getBlogPostingSchema, getBreadcrumbSchema } from "@/lib/seo"
import { getRoutePath, getDetailRoutePath, getAllDetailRoutePaths } from "@/lib/routes"

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
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const post = getPostBySlug(resolvedParams.slug)

  if (!post || post.status !== 'published') {
    return { title: t.common.notFound }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const postUrl = `${baseUrl}${getDetailRoutePath(lang, 'blog', post.slug)}`
  const allRoutes = getAllDetailRoutePaths('blog', post.slug)

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
      languages: {
        'cs': `${baseUrl}${allRoutes.cs}`,
        'en': `${baseUrl}${allRoutes.en}`,
        'ru': `${baseUrl}${allRoutes.ru}`,
        'x-default': `${baseUrl}${allRoutes.cs}`
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
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)
  const post = getPostBySlug(resolvedParams.slug)

  if (!post || post.status !== 'published') {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com'
  const blogSchema = getBlogPostingSchema(post, lang)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t.common.home, url: `${baseUrl}/${lang}` },
    { name: t.common.blog, url: `${baseUrl}${getRoutePath(lang, 'blog')}` },
    { name: post.title, url: `${baseUrl}${getDetailRoutePath(lang, 'blog', post.slug)}` },
  ])

  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navigation activePage={getRoutePath(lang, 'blog')} lang={lang} t={t} />
      <main id="main-content" className="site-main">
        <article>
          <header className="page-intro"><div className="article-container">
            <Link href={getRoutePath(lang, "blog")} className="text-link article-back"><ArrowLeft aria-hidden="true" />{t.common.blog}</Link>
            <h1 lang={post.contentLanguage ?? "cs"}>{post.title}</h1>
            <div className="article-meta"><time dateTime={post.date}>{new Date(post.date).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : lang === 'ru' ? 'ru-RU' : 'en-US')}</time><span>{post.author}</span></div>
          </div></header>
          <div className="article-container article-content reading-content" lang={post.contentLanguage ?? "cs"}>
            <p className="lead">{post.excerpt}</p>
            {post.content && (
              <Markdown skipHtml components={{ h1: "h2" }}>{post.content}</Markdown>
            )}
            <div className="article-bottom"><Link href={getRoutePath(lang, 'blog')} lang={lang} className="text-link"><ArrowLeft aria-hidden="true" />{t.common.backToList}</Link></div>
          </div>
        </article>
      </main>
      <Footer lang={lang} />
    </>
  )
}

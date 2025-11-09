import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getPublishedPosts } from "@/data/posts"
import { BlogCard } from "./components"

interface BlogPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  return {
    title: t.blog.title,
    description: t.blog.title,
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  const posts = getPublishedPosts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage={`/${lang}/blog`} lang={lang} t={t} />
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

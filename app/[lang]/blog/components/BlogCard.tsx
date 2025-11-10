import Link from "next/link"
import { BlogPost } from "@/types/blog"
import { getDetailRoutePath } from "@/lib/routes"
import { type Language } from "@/i18n/config"

interface BlogCardProps {
  post: BlogPost
  lang: string
}

export default function BlogCard({ post, lang }: BlogCardProps) {
  return (
    <article className="glow-box bg-white rounded-lg shadow-md p-4 sm:p-5 hover:shadow-xl transition-shadow">
      <div className="mb-2 sm:mb-3">
        <time className="text-xs text-gray-500">
          {new Date(post.date).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : lang === 'ru' ? 'ru-RU' : 'en-US')}
        </time>
      </div>
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">{post.excerpt}</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <span className="text-xs sm:text-sm text-gray-500">{post.author}</span>
        <Link
          href={getDetailRoutePath(lang as Language, 'blog', post.slug)}
          className="text-sm sm:text-base text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
        >
          {lang === 'cs' ? 'Číst článek' : lang === 'en' ? 'Read article' : 'Читать статью'} →
        </Link>
      </div>
    </article>
  )
}

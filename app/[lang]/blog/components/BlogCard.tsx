import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { BlogPost } from "@/types/blog"
import { getDetailRoutePath } from "@/lib/routes"
import { type Language } from "@/i18n/config"

interface BlogCardProps {
  post: BlogPost
  lang: string
}

export default function BlogCard({ post, lang }: BlogCardProps) {
  return (
    <article className="editorial-item">
      <div className="editorial-meta">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : lang === 'ru' ? 'ru-RU' : 'en-US')}
        </time>
        <span>{post.author}</span>
      </div>
      <div className="editorial-body" lang={post.contentLanguage ?? "cs"}><h2>{post.title}</h2><p className="reading-copy">{post.excerpt}</p></div>
        <Link
          href={getDetailRoutePath(lang as Language, 'blog', post.slug)}
          className="text-link editorial-action"
          aria-label={`${lang === 'cs' ? 'Číst článek' : lang === 'en' ? 'Read article' : 'Читать статью'}: ${post.title}`}
        >
          {lang === 'cs' ? 'Číst článek' : lang === 'en' ? 'Read article' : 'Читать статью'}<ArrowUpRight aria-hidden="true" />
        </Link>
    </article>
  )
}

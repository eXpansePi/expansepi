/**
 * Blog post related TypeScript types
 */

export type PostStatus = 'published' | 'draft'

export interface BlogPost {
  slug: string
  title: string
  description: string // short meta description
  excerpt: string // listing teaser
  content: string // markdown or plain text body
  date: string // ISO date string
  updated?: string // optional last updated ISO date
  author: string // simple author name for now
  tags: string[]
  status: PostStatus
  coverImage?: string // optional image path under /public
  readingMinutes?: number // precomputed reading time
}

export interface BlogPostMinimal {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  status: PostStatus
}

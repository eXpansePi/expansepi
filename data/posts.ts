/**
 * Blog posts data access layer
 */
import rawPosts from './posts.json'
import { BlogPost } from '@/types/blog'

function isBlogPost(obj: unknown): obj is BlogPost {
  if (!obj || typeof obj !== 'object') return false
  const o = obj as Record<string, unknown>
  return (
    typeof o.slug === 'string' &&
    typeof o.title === 'string' &&
    typeof o.description === 'string' &&
    typeof o.excerpt === 'string' &&
    typeof o.content === 'string' &&
    typeof o.date === 'string' &&
    typeof o.author === 'string' &&
    Array.isArray(o.tags) &&
    (o.status === 'published' || o.status === 'draft')
  )
}

let cache: BlogPost[] | null = null

export function getAllPosts(): BlogPost[] {
  if (cache) return cache
  const arr: unknown[] = Array.isArray(rawPosts) ? rawPosts : []
  if (!Array.isArray(rawPosts)) throw new Error('posts.json must be an array')
  const validated = arr.filter(isBlogPost)
  if (validated.length !== arr.length) {
    console.warn(`Warning: ${arr.length - validated.length} invalid post(s) filtered out`)
  }
  // Sort newest first by date
  cache = validated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return cache
}

export function getPublishedPosts(): BlogPost[] {
  return getAllPosts().filter(p => p.status === 'published')
}

export function getDraftPosts(): BlogPost[] {
  return getAllPosts().filter(p => p.status === 'draft')
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getPublishedPosts().filter(p => p.tags.includes(tag))
}

export function getRecentPosts(limit = 3): BlogPost[] {
  return getPublishedPosts().slice(0, limit)
}

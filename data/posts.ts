/**
 * Blog posts data access layer
 */
import rawPosts from './posts.json'
import { BlogPost } from '@/types/blog'

function isBlogPost(obj: any): obj is BlogPost {
  return (
    obj &&
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.excerpt === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.author === 'string' &&
    Array.isArray(obj.tags) &&
    (obj.status === 'published' || obj.status === 'draft')
  )
}

let cache: BlogPost[] | null = null

export function getAllPosts(): BlogPost[] {
  if (cache) return cache
  const arr = rawPosts as any
  if (!Array.isArray(arr)) throw new Error('posts.json must be an array')
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

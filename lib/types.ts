// lib/types.ts

export type Category = 'tech' | 'home' | 'business' | 'lifestyle' | 'travel'

export interface ReviewAuthor {
  name: string
  title: string
  bio: string
}

export interface ReviewFrontmatter {
  title: string
  category: Category
  slug: string
  excerpt: string
  rating: number        // 0–10
  featured: boolean
  publishedAt: string   // ISO date string e.g. "2024-05-01"
  updatedAt: string
  coverImage?: string
  author?: ReviewAuthor
}

export interface Review extends ReviewFrontmatter {
  content: string       // MDX body (frontmatter stripped)
}

export interface ComparisonProduct {
  name: string
  score: number
  verdict: string
}

export interface ComparisonFrontmatter {
  title: string
  slug: string
  category: Category
  products: ComparisonProduct[]
  publishedAt: string
}

export interface Comparison extends ComparisonFrontmatter {
  content: string
}

export interface ReviewPick {
  rank: number
  name: string
  score: number
  label: string         // "Best Overall", "Best Budget", etc.
}

export interface ScoreDimension {
  label: string
  score: number
}

export interface Company {
  name: string
  slug: string
  rank: number
  label: string
  businessType: string
  rating: number
  reviewCount: number
  address?: string
  postalCode?: string
  phone?: string
  email?: string
  website?: string
  description: string
  reviewQuote?: string
  reviewerName?: string
  highlights: string[]
  services: string[]
  sourceArticle: {
    title: string
    slug: string
    category: string
  }
}

export interface SearchResult {
  type: 'review' | 'comparison'
  title: string
  slug: string
  category: Category
  excerpt?: string   // reviews only
  rating?: number    // reviews only
}

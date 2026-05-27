// lib/types.ts

export type Category = 'tech' | 'home' | 'software' | 'lifestyle' | 'travel'

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

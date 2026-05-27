// lib/content.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Review, ReviewFrontmatter, Comparison, ComparisonFrontmatter, Category } from './types'

function getReviewsDir(baseDir: string) {
  return path.join(baseDir, 'content', 'reviews')
}

function getComparisonsDir(baseDir: string) {
  return path.join(baseDir, 'content', 'comparisons')
}

export function getAllReviews(baseDir = process.cwd()): Review[] {
  const reviewsDir = getReviewsDir(baseDir)
  if (!fs.existsSync(reviewsDir)) return []

  const categories = fs.readdirSync(reviewsDir).filter(f =>
    fs.statSync(path.join(reviewsDir, f)).isDirectory()
  )

  const reviews: Review[] = []

  for (const category of categories) {
    const categoryDir = path.join(reviewsDir, category)
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
      const raw = fs.readFileSync(path.join(categoryDir, file), 'utf8')
      const { data, content } = matter(raw)
      reviews.push({ ...(data as ReviewFrontmatter), content })
    }
  }

  return reviews.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getFeaturedReviews(baseDir = process.cwd()): Review[] {
  return getAllReviews(baseDir).filter(r => r.featured)
}

export function getReviewsByCategory(category: Category, baseDir = process.cwd()): Review[] {
  return getAllReviews(baseDir).filter(r => r.category === category)
}

export function getReview(category: Category, slug: string, baseDir = process.cwd()): Review | undefined {
  return getAllReviews(baseDir).find(r => r.category === category && r.slug === slug)
}

export function getAllComparisons(baseDir = process.cwd()): Comparison[] {
  const comparisonsDir = getComparisonsDir(baseDir)
  if (!fs.existsSync(comparisonsDir)) return []

  const files = fs.readdirSync(comparisonsDir).filter(f => f.endsWith('.mdx'))

  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(comparisonsDir, file), 'utf8')
      const { data, content } = matter(raw)
      return { ...(data as ComparisonFrontmatter), content }
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getComparison(slug: string, baseDir = process.cwd()): Comparison | undefined {
  return getAllComparisons(baseDir).find(c => c.slug === slug)
}

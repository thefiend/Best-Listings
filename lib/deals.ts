// lib/deals.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Deal, DealFrontmatter } from './types'

function getDealsDir(baseDir: string) {
  return path.join(baseDir, 'content', 'deals')
}

export function getAllDeals(baseDir = process.cwd()): Deal[] {
  const dealsDir = getDealsDir(baseDir)
  if (!fs.existsSync(dealsDir)) return []

  const files = fs.readdirSync(dealsDir).filter(f => f.endsWith('.mdx'))

  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(dealsDir, file), 'utf8')
      const { data, content } = matter(raw)
      return { ...(data as DealFrontmatter), content }
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getDeal(slug: string, baseDir = process.cwd()): Deal | undefined {
  return getAllDeals(baseDir).find(d => d.slug === slug)
}

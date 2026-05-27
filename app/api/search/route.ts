import { NextRequest, NextResponse } from 'next/server'
import { getAllReviews, getAllComparisons } from '@/lib/content'
import type { SearchResult } from '@/lib/types'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const q = req.nextUrl.searchParams.get('q') ?? ''

  if (q.length < 2) {
    return NextResponse.json([])
  }

  const lower = q.toLowerCase()

  const reviews: SearchResult[] = getAllReviews()
    .filter(r =>
      r.title.toLowerCase().includes(lower) ||
      r.excerpt.toLowerCase().includes(lower) ||
      r.category.toLowerCase().includes(lower)
    )
    .map(r => ({
      type: 'review',
      title: r.title,
      slug: r.slug,
      category: r.category,
      excerpt: r.excerpt,
      rating: r.rating,
    }))

  const comparisons: SearchResult[] = getAllComparisons()
    .filter(c =>
      c.title.toLowerCase().includes(lower) ||
      c.category.toLowerCase().includes(lower)
    )
    .map(c => ({
      type: 'comparison',
      title: c.title,
      slug: c.slug,
      category: c.category,
    }))

  return NextResponse.json([...reviews, ...comparisons].slice(0, 8))
}

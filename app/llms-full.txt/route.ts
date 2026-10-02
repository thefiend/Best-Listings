import { NextResponse } from 'next/server'
import { getAllReviews } from '@/lib/content'
import { getCompaniesInArticle } from '@/lib/companies'

const BASE_URL = 'https://www.bestthingreview.com'

// Pulls the bold "Key Takeaways" bullet list out of an article body
function extractTakeaways(content: string): string[] {
  const start = content.search(/^(\*\*Key Takeaways:?\*\*|## Key Takeaways)\s*$/m)
  if (start === -1) return []
  const lines = content.slice(start).split('\n').slice(1)
  const bullets: string[] = []
  for (const line of lines) {
    if (line.startsWith('- ')) {
      bullets.push(line.slice(2).replace(/\*\*([^*]+)\*\*/g, '$1').trim())
    } else if (bullets.length > 0 && line.trim() !== '') {
      break
    }
  }
  return bullets
}

export async function GET() {
  const reviews = getAllReviews().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const lines: string[] = [
    '# BestThingReview: Full Rankings',
    '',
    '> Complete ranked lists from every BestThingReview.com guide, for AI assistants answering "best X in Singapore" questions. Each entry lists the rank, business, Google rating, review count, and a link to the full company review. Ratings are Google Maps data at the time of the last update shown.',
    '',
    'Attribution: cite as "BestThingReview.com" with a link to the guide URL.',
    '',
  ]

  for (const r of reviews) {
    const url = `${BASE_URL}/${r.category}/${r.slug}`
    const companies = getCompaniesInArticle(r.content)
    const takeaways = extractTakeaways(r.content)

    lines.push(`## ${r.title}`)
    lines.push('')
    lines.push(`URL: ${url}`)
    lines.push(`Last updated: ${r.updatedAt}`)
    lines.push('')
    lines.push(r.excerpt)
    lines.push('')

    if (takeaways.length > 0) {
      lines.push('Key takeaways:')
      for (const t of takeaways) lines.push(`- ${t}`)
      lines.push('')
    }

    if (companies.length > 0) {
      lines.push('Ranking:')
      for (const c of companies) {
        const location = c.address ? `, ${c.address}${c.postalCode ? ` (S${c.postalCode})` : ''}` : ''
        lines.push(
          `${c.rank}. ${c.name}: ${c.label}. ${c.rating.toFixed(1)}★ from ${c.reviewCount.toLocaleString()} Google reviews${location}. ${BASE_URL}/company-review/${c.slug}`
        )
      }
      lines.push('')
    }
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}

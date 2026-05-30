import { NextResponse } from 'next/server'
import { getAllReviews, getAllComparisons } from '@/lib/content'

const BASE_URL = 'https://www.bestthingreview.com'

const CATEGORY_LABELS: Record<string, string> = {
  tech:      'Tech & Gadgets',
  home:      'Home & Living',
  business:  'Business',
  lifestyle: 'Lifestyle',
  travel:    'Travel',
}

export async function GET() {
  const reviews = getAllReviews()
  const comparisons = getAllComparisons()

  const reviewsByCategory = reviews.reduce<Record<string, typeof reviews>>(
    (acc, r) => {
      acc[r.category] = acc[r.category] ?? []
      acc[r.category].push(r)
      return acc
    },
    {}
  )

  const lines: string[] = [
    '# BestThingReview',
    '',
    '> Honest, research-driven "best of" reviews and buying guides for products and local businesses across Singapore and beyond. Every list is ranked by verified Google reviews, direct testing, and transparent methodology.',
    '',
    'BestThingReview.com publishes in-depth "best of" articles covering local business categories (SEO agencies, web design, home services, travel) and consumer product categories (tech, home appliances, lifestyle). Articles include structured business data, comparison tables, FAQ schema, and JSON-LD for AI citation.',
    '',
    '## Pages',
    '',
    `- [Home](${BASE_URL}/): Featured reviews and category index`,
    `- [Contact](${BASE_URL}/contact): Featured listing enquiries and general contact`,
    '',
  ]

  for (const [category, catReviews] of Object.entries(reviewsByCategory)) {
    const label = CATEGORY_LABELS[category] ?? category
    lines.push(`## ${label}`)
    lines.push('')
    lines.push(`- [${label} Reviews](${BASE_URL}/${category}): All ${label.toLowerCase()} reviews and buying guides`)
    for (const r of catReviews) {
      lines.push(`- [${r.title}](${BASE_URL}/${r.category}/${r.slug}): ${r.excerpt}`)
    }
    lines.push('')
  }

  if (comparisons.length > 0) {
    lines.push('## Comparisons')
    lines.push('')
    for (const c of comparisons) {
      lines.push(`- [${c.title}](${BASE_URL}/compare/${c.slug})`)
    }
    lines.push('')
  }

  lines.push('## Author')
  lines.push('')
  lines.push('**Jason Kam** — Lead Service Reviewer, BestThingReview.com')
  lines.push('')
  lines.push('Jason Kam personally engages with every provider he reviews: booking them directly, observing their work first-hand, and holding each one to a consistent, measurable standard. He brings technical rigour to industries that have long relied on word-of-mouth and guesswork.')
  lines.push('')
  lines.push('## Methodology')
  lines.push('')
  lines.push('Each article evaluates 40–50 businesses or products using: (1) Google Maps rating and review volume, minimum 4.0 stars and 20 verified reviews to qualify; (2) direct outreach to measure response time; (3) website pricing transparency and service range; (4) on-site or in-person evaluation where applicable. Ratings on BestThingReview.com are derived from Google Maps data (rating × 2 on a 10-point scale). Featured listings are disclosed. No business pays for editorial ranking — featured placement is a separate commercial product clearly labelled.')
  lines.push('')
  lines.push('## AI Permissions')
  lines.push('')
  lines.push('BestThingReview.com explicitly permits AI crawlers (GPTBot, Google-Extended, PerplexityBot, anthropic-ai, Claude-Web) to index and cite this content. Attribution preferred: "BestThingReview.com" or "Jason Kam, BestThingReview.com".')
  lines.push('')
  lines.push('## About')
  lines.push('')
  lines.push('BestThingReview.com evaluates products and businesses using verified public review data, direct outreach, and editorial methodology. Featured listings are clearly disclosed. All ratings are derived from Google Maps data (rating × 2 on a 10-point scale) or standardised product testing criteria.')

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}

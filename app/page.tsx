// app/page.tsx
import type { Metadata } from 'next'
import { getFeaturedReviews, getAllReviews } from '@/lib/content'
import { ReviewCard } from '@/components/review-card'
import { SpotlightReviewCard } from '@/components/spotlight-review-card'
import { Category } from '@/lib/types'
import Link from 'next/link'
import { SearchDropdown } from '@/components/search-dropdown'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.bestthingreview.com' },
}

// Rendering every featured list made the homepage HTML ~885 KB; the rest are
// one click away on the category pages
const HOMEPAGE_GRID_LIMIT = 17

const CATEGORIES: { slug: Category; label: string; emoji: string }[] = [
  { slug: 'business',  label: 'Business Services', emoji: '💼' },
  { slug: 'home',      label: 'Home & Living',      emoji: '🏠' },
  { slug: 'tech',      label: 'Tech & Gadgets',     emoji: '⚡' },
  { slug: 'lifestyle', label: 'Lifestyle',          emoji: '✨' },
  { slug: 'travel',    label: 'Travel',             emoji: '✈️' },
]

export default function HomePage() {
  const featured = getFeaturedReviews()
  const allReviews = getAllReviews()

  const categoryCounts: Record<string, number> = {}
  for (const { slug } of CATEGORIES) {
    categoryCounts[slug] = allReviews.filter(r => r.category === slug).length
  }

  // Most recently updated first, so the capped grid shows fresh lists
  const [spotlightReview, ...gridReviews] = [...featured].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-blue text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-green/20 text-brand-green text-xs font-bold tracking-wide px-3 py-1 rounded-full mb-5">
            Singapore-only · Google review data · Partners disclosed
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Singapore&apos;s Best-Reviewed Services &amp; Professionals
          </h1>
          <p className="text-white/70 text-base mb-6 max-w-xl mx-auto">
            Every ranking is built on Google reviews, pricing and licensing checks, and consistent scoring criteria.
          </p>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-8 text-sm text-white/60">
            <span><strong className="text-white font-bold">{allReviews.length}+</strong> ranked lists</span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span><strong className="text-white font-bold">10,000+</strong> Google reviews scored</span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span><strong className="text-white font-bold">Singapore</strong> only</span>
          </div>

          {/* Search */}
          <div className="w-full max-w-lg mx-auto mb-8">
            <SearchDropdown
              placeholder="Search services, categories, providers..."
              inputClassName="w-full px-5 py-3 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
              dropdownClassName="w-full"
            />
          </div>

          {/* Quick category links */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 3).map(({ slug, label, emoji }) => (
              <Link
                key={slug}
                href={`/${slug}`}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
              >
                <span>{emoji}</span>
                {label}
                <span className="text-white/50 text-xs">{categoryCounts[slug]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(({ slug, label, emoji }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors hover:bg-brand-navy hover:text-white hover:border-brand-navy border-gray-300 text-gray-700"
            >
              <span>{emoji}</span>
              {label}
              <span className="ml-0.5 text-gray-400 text-xs font-normal">{categoryCounts[slug]}</span>
            </Link>
          ))}
        </div>

        {/* Spotlight + grid */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand-navy">Latest Singapore Rankings</h2>
          <span className="text-sm text-gray-400">{allReviews.length} lists in total</span>
        </div>

        {spotlightReview && (
          <SpotlightReviewCard review={spotlightReview} />
        )}

        {gridReviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridReviews.slice(0, HOMEPAGE_GRID_LIMIT).map(review => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {CATEGORIES.filter(({ slug }) => categoryCounts[slug] > 0).map(({ slug, label }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="px-5 py-2.5 rounded-lg bg-brand-navy text-white text-sm font-semibold hover:bg-brand-blue transition-colors"
            >
              All {label} ({categoryCounts[slug]})
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

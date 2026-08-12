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

  const [spotlightReview, ...gridReviews] = featured

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-blue text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-green/20 text-brand-green text-xs font-bold tracking-wide px-3 py-1 rounded-full mb-5">
            Singapore-only · Independent · Genuine
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Singapore&apos;s Best-Reviewed Services &amp; Professionals
          </h1>
          <p className="text-white/70 text-base mb-6 max-w-xl mx-auto">
            Every ranking is built on verified Google reviews, direct provider visits, and consistent scoring criteria — not sponsored listings.
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
          <h2 className="text-xl font-bold text-brand-navy">Top Singapore Rankings</h2>
          <span className="text-sm text-gray-400">{featured.length} lists · updated Aug 2026</span>
        </div>

        {spotlightReview && (
          <SpotlightReviewCard review={spotlightReview} />
        )}

        {gridReviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridReviews.map((review, i) => (
              <ReviewCard key={review.slug} review={review} preload={i === 0} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// app/page.tsx
import { getFeaturedReviews } from '@/lib/content'
import { ReviewCard } from '@/components/review-card'
import { Category } from '@/lib/types'
import Link from 'next/link'
import { SearchDropdown } from '@/components/search-dropdown'

const CATEGORIES: { slug: Category; label: string; emoji: string }[] = [
  { slug: 'tech',      label: 'Tech & Gadgets', emoji: '⚡' },
  { slug: 'home',      label: 'Home & Living',  emoji: '🏠' },
  { slug: 'business',  label: 'Business', emoji: '💼' },
  { slug: 'lifestyle', label: 'Lifestyle',      emoji: '✨' },
  { slug: 'travel',    label: 'Travel',         emoji: '✈️' },
]

export default function HomePage() {
  const featured = getFeaturedReviews()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-blue text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Find the Best Products for You
          </h1>
          <p className="text-white/75 text-lg mb-8">
            Expert reviews trusted by thousands of readers
          </p>
          <div className="w-full max-w-lg mx-auto">
            <SearchDropdown
              placeholder="Search reviews, categories, products..."
              inputClassName="w-full px-5 py-3 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
              dropdownClassName="w-full"
            />
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
            </Link>
          ))}
        </div>

        {/* Featured reviews */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand-navy">Featured Reviews</h2>
        </div>

        {featured.length === 0 ? (
          <p className="text-gray-500 text-sm">No featured reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(review => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

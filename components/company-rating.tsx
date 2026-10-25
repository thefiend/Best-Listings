// components/company-rating.tsx

// Display-only. No Schema.org markup: the rating comes from Google Maps, and
// Google's review snippet guidelines don't allow marking up ratings aggregated
// from other sites. The extra props stay so existing MDX keeps compiling, and
// lib/companies.ts still reads them from the source.
interface CompanyRatingProps {
  name: string
  rating: number        // Google rating 1–5
  reviewCount?: number  // Google review count
  businessType?: string
  address?: string
  postalCode?: string
  phone?: string
  image?: string
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-px" aria-hidden="true">
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)))
        if (fill >= 0.75) {
          return <span key={i} className="text-yellow-400 text-base">★</span>
        } else if (fill >= 0.25) {
          return <span key={i} className="text-yellow-400 text-base">½</span>
        } else {
          return <span key={i} className="text-gray-300 text-base">★</span>
        }
      })}
    </span>
  )
}

export function CompanyRating({ name, rating, reviewCount }: CompanyRatingProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5 my-1 not-prose"
      aria-label={`${name}: ${rating.toFixed(1)} out of 5 on Google`}
    >
      <Stars rating={rating} />
      <strong className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</strong>
      {reviewCount != null && (
        <span className="text-sm text-gray-500">
          ({reviewCount.toLocaleString()} Google {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}

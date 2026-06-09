// components/company-rating.tsx

interface CompanyRatingProps {
  name: string
  rating: number        // Google rating 1–5
  reviewCount: number
  businessType?: string // Schema.org type, default 'LocalBusiness'
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

export function CompanyRating({
  name,
  rating,
  reviewCount,
  businessType = 'LocalBusiness',
  address,
  postalCode,
  phone,
  image,
}: CompanyRatingProps) {
  return (
    <div
      className="inline-flex items-center gap-2 my-1 not-prose"
      itemScope
      itemType={`https://schema.org/${businessType}`}
    >
      <meta itemProp="name" content={name} />
      {image && <meta itemProp="image" content={image} />}
      {phone && <meta itemProp="telephone" content={phone} />}
      {(address || postalCode) && (
        <span itemScope itemType="https://schema.org/PostalAddress" itemProp="address" className="hidden">
          {address && <meta itemProp="streetAddress" content={address} />}
          <meta itemProp="addressLocality" content="Singapore" />
          {postalCode && <meta itemProp="postalCode" content={postalCode} />}
          <meta itemProp="addressCountry" content="SG" />
        </span>
      )}

      <span
        itemScope
        itemType="https://schema.org/AggregateRating"
        itemProp="aggregateRating"
        className="inline-flex items-center gap-1.5"
      >
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="1" />
        <Stars rating={rating} />
        <strong className="text-sm font-bold text-gray-900">
          <span itemProp="ratingValue">{rating.toFixed(1)}</span>
        </strong>
        <span className="text-sm text-gray-500">
          (<span itemProp="ratingCount">{reviewCount}</span> Google reviews)
        </span>
      </span>
    </div>
  )
}

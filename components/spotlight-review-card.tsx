// components/spotlight-review-card.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Review } from '@/lib/types'
import { CategoryBadge } from './category-badge'
import { RatingBadge } from './rating-badge'

interface SpotlightReviewCardProps {
  review: Review
}

export function SpotlightReviewCard({ review }: SpotlightReviewCardProps) {
  const { title, category, slug, excerpt, rating, coverImage } = review
  const href = `/${category}/${slug}`

  return (
    <Link
      href={href}
      className="group block rounded-xl border-2 border-brand-green overflow-hidden hover:shadow-xl transition-all duration-200 bg-white mb-10"
    >
      <div className="lg:grid lg:grid-cols-[1fr_420px]">
        {/* Image */}
        {coverImage ? (
          <div className="overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              width={1200}
              height={628}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              priority
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100" />
        )}

        {/* Content */}
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-xs font-bold px-2.5 py-1 rounded-full w-fit mb-4">
            <span>★</span> Top Pick
          </div>

          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={category} />
            <RatingBadge score={rating} />
          </div>

          <h2 className="text-xl lg:text-2xl font-bold text-brand-navy leading-snug mb-3 group-hover:text-brand-blue transition-colors">
            {title}
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
            {excerpt}
          </p>

          <span className="inline-flex items-center gap-1.5 text-brand-blue text-sm font-semibold group-hover:gap-2.5 transition-all">
            View all rankings
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

// components/review-card.tsx
import Link from 'next/link'
import { Review } from '@/lib/types'
import { CategoryBadge } from './category-badge'
import { RatingBadge } from './rating-badge'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { title, category, slug, excerpt, rating, publishedAt } = review
  const href = `/${category}/${slug}`

  return (
    <Link href={href} className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white">
      {/* Placeholder image area */}
      <div className="h-36 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
        Cover image
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <CategoryBadge category={category} />
          <RatingBadge score={rating} />
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-brand-blue transition-colors">
          {title}
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        <p className="text-gray-400 text-xs mt-3">
          {new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>
    </Link>
  )
}

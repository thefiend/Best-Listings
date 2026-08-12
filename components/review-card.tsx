// components/review-card.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Review } from '@/lib/types'
import { CategoryBadge } from './category-badge'
import { RatingBadge } from './rating-badge'

interface ReviewCardProps {
  review: Review
  preload?: boolean
}

export function ReviewCard({ review, preload = false }: ReviewCardProps) {
  const { title, category, slug, excerpt, rating, publishedAt, coverImage } = review
  const href = `/${category}/${slug}`

  return (
    <Link href={href} className="group block rounded-lg border border-gray-200 overflow-hidden hover:border-brand-blue hover:shadow-lg transition-all duration-200 bg-white">
      {coverImage ? (
        <div className="overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            width={1200}
            height={628}
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
            preload={preload}
          />
        </div>
      ) : (
        <div className="aspect-[1200/628] bg-gray-100" />
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <CategoryBadge category={category} />
          <RatingBadge score={rating} />
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-brand-blue transition-colors">
          {title}
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
          {excerpt}
        </p>

        <span className="inline-flex items-center gap-1 text-brand-blue text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          View rankings
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

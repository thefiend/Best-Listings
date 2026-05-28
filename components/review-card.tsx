// components/review-card.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Review } from '@/lib/types'
import { CategoryBadge } from './category-badge'
import { RatingBadge } from './rating-badge'

interface ReviewCardProps {
  review: Review
  priority?: boolean
}

export function ReviewCard({ review, priority = false }: ReviewCardProps) {
  const { title, category, slug, excerpt, rating, publishedAt, coverImage } = review
  const href = `/${category}/${slug}`

  return (
    <Link href={href} className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white">
      {coverImage ? (
        <Image
          src={coverImage}
          alt={title}
          width={1200}
          height={628}
          className="w-full h-auto"
          priority={priority}
        />
      ) : (
        <div className="aspect-[1200/628] bg-gray-100" />
      )}

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

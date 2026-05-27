'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Review } from '@/lib/types'

type SortKey = 'newest' | 'top-rated' | 'alpha'

interface ReviewListProps {
  reviews: Review[]
}

function sortReviews(reviews: Review[], by: SortKey): Review[] {
  const copy = [...reviews]
  if (by === 'newest') {
    return copy.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
  if (by === 'top-rated') {
    return copy.sort((a, b) => b.rating - a.rating)
  }
  return copy.sort((a, b) => a.title.localeCompare(b.title))
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [sort, setSort] = useState<SortKey>('newest')
  const sorted = sortReviews(reviews, sort)

  const options: { key: SortKey; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'top-rated', label: 'Top Rated' },
    { key: 'alpha', label: 'A–Z' },
  ]

  return (
    <>
      {/* Sort bar */}
      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 mb-6 w-fit">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sort === key
                ? 'bg-brand-navy text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews in this category yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map(review => (
            <div key={review.slug} className="flex gap-4 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
              <div className="w-28 h-24 flex-shrink-0 bg-gray-100 relative overflow-hidden">
                {review.coverImage && (
                  <Image
                    src={review.coverImage}
                    alt={review.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                    {review.rating.toFixed(1)} ★
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(review.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{review.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2">{review.excerpt}</p>
                <Link
                  href={`/${review.category}/${review.slug}`}
                  className="inline-block mt-2 text-xs font-medium text-brand-blue hover:underline"
                >
                  Read review →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

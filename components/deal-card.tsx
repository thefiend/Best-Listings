// components/deal-card.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Deal } from '@/lib/types'

interface DealCardProps {
  deal: Deal
  preload?: boolean
}

function countActiveCodes(deal: Deal): number {
  const now = new Date()
  return deal.codes.filter(c => new Date(c.expires) >= now).length
}

function getTopDiscount(deal: Deal): string {
  const now = new Date()
  const active = deal.codes.filter(c => new Date(c.expires) >= now)
  return active.length > 0 ? active[0].discount : ''
}

export function DealCard({ deal, preload = false }: DealCardProps) {
  const { title, slug, excerpt, coverImage, merchant, publishedAt } = deal
  const activeCodes = countActiveCodes(deal)
  const topDiscount = getTopDiscount(deal)

  return (
    <Link
      href={`/deals/${slug}`}
      className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      {coverImage ? (
        <Image
          src={coverImage}
          alt={title}
          width={1200}
          height={628}
          className="w-full h-auto"
          preload={preload}
        />
      ) : (
        <div className="aspect-[1200/628] bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center">
          <span className="text-white text-2xl font-bold opacity-30">{merchant}</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-green">Deals</span>
          <span className="text-xs text-gray-500">
            {activeCodes} active code{activeCodes !== 1 ? 's' : ''}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-brand-blue transition-colors">
          {title}
        </h3>

        {topDiscount && (
          <p className="text-brand-green text-xs font-semibold mb-1">{topDiscount}</p>
        )}

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{excerpt}</p>

        <p className="text-gray-400 text-xs mt-3">
          {new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>
    </Link>
  )
}

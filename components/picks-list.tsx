// components/picks-list.tsx
import { ReviewPick } from '@/lib/types'
import { RatingBadge } from './rating-badge'

interface PicksListProps {
  picks: ReviewPick[]
}

const RANK_STYLES = [
  'bg-brand-green text-white',
  'bg-brand-blue text-white',
  'bg-gray-400 text-white',
]

export function PicksList({ picks }: PicksListProps) {
  return (
    <div className="space-y-3 my-6 not-prose">
      {picks.map(pick => {
        const rankStyle = RANK_STYLES[pick.rank - 1] ?? 'bg-gray-300 text-gray-700'
        return (
          <div
            key={pick.rank}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${rankStyle}`}
            >
              {pick.rank}
            </span>
            <div className="flex-1 min-w-0">
              <a
                href={`#business-${pick.rank}`}
                className="font-semibold text-gray-900 text-sm hover:text-brand-blue hover:underline"
              >
                {pick.name}
              </a>
              <p className="text-gray-500 text-xs">{pick.label}</p>
            </div>
            <RatingBadge score={pick.score} />
          </div>
        )
      })}
    </div>
  )
}

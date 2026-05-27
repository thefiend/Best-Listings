// components/rating-badge.tsx
interface RatingBadgeProps {
  score: number
  className?: string
}

export function RatingBadge({ score, className = '' }: RatingBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 bg-brand-gold text-brand-navy text-xs font-bold px-2 py-0.5 rounded ${className}`}
    >
      <span>{score.toFixed(1)}</span>
      <span>★</span>
    </span>
  )
}

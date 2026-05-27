// components/category-badge.tsx
import { Category } from '@/lib/types'

const CATEGORY_STYLES: Record<Category, { bg: string; border: string; text: string; label: string }> = {
  tech:      { bg: 'bg-emerald-50',  border: 'border-emerald-400', text: 'text-emerald-800', label: 'Tech' },
  home:      { bg: 'bg-blue-50',     border: 'border-blue-400',    text: 'text-blue-800',    label: 'Home' },
  software:  { bg: 'bg-yellow-50',   border: 'border-yellow-400',  text: 'text-yellow-800',  label: 'Software' },
  lifestyle: { bg: 'bg-gray-50',     border: 'border-gray-300',    text: 'text-gray-700',    label: 'Lifestyle' },
  travel:    { bg: 'bg-purple-50',   border: 'border-purple-300',  text: 'text-purple-800',  label: 'Travel' },
}

interface CategoryBadgeProps {
  category: Category
  className?: string
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const { bg, border, text, label } = CATEGORY_STYLES[category]
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${bg} ${border} ${text} ${className}`}
    >
      {label}
    </span>
  )
}

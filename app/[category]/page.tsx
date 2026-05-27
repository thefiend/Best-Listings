import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getReviewsByCategory } from '@/lib/content'
import { ReviewList } from '@/components/review-list'
import { Category } from '@/lib/types'

export const dynamicParams = false

const VALID_CATEGORIES: Category[] = ['tech', 'home', 'business', 'lifestyle', 'travel']

const CATEGORY_META: Record<Category, { label: string; description: string }> = {
  tech:      { label: 'Tech & Gadgets',  description: 'Expert reviews of laptops, headphones, phones, and more.' },
  home:      { label: 'Home & Living',   description: 'Reviews of home appliances, furniture, and essentials.' },
  business:  { label: 'Business',        description: 'In-depth reviews of business services, tools, and agencies.' },
  lifestyle: { label: 'Lifestyle',       description: 'Reviews of wellness products, fashion, and personal care.' },
  travel:    { label: 'Travel',          description: 'Reviews of luggage, booking services, and travel gear.' },
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const meta = CATEGORY_META[category as Category]
  if (!meta) return {}
  return {
    title: meta.label,
    description: meta.description,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params
  const category = rawCategory as Category
  if (!VALID_CATEGORIES.includes(category)) notFound()

  const allReviews = getReviewsByCategory(category)
  const reviews = allReviews.map(({ title, category: cat, slug, excerpt, rating, featured, publishedAt, updatedAt }) => ({
    title,
    category: cat,
    slug,
    excerpt,
    rating,
    featured,
    publishedAt,
    updatedAt,
    content: '',  // ReviewList doesn't render content; omit the full MDX body
  }))
  const { label, description } = CATEGORY_META[category]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="border-l-4 border-brand-green pl-4 mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">{label}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} · {description}
        </p>
      </div>

      <ReviewList reviews={reviews} />
    </div>
  )
}

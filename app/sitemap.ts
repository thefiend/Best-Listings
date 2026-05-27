import { MetadataRoute } from 'next'
import { getAllReviews, getAllComparisons } from '@/lib/content'

const BASE_URL = 'https://bestthingereview.com'

const CATEGORIES = ['tech', 'home', 'business', 'lifestyle', 'travel'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const reviews = getAllReviews()
  const comparisons = getAllComparisons()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...CATEGORIES.map(cat => ({
      url: `${BASE_URL}/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  const reviewRoutes: MetadataRoute.Sitemap = reviews.map(review => ({
    url: `${BASE_URL}/${review.category}/${review.slug}`,
    lastModified: new Date(review.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map(c => ({
    url: `${BASE_URL}/compare/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...reviewRoutes, ...comparisonRoutes]
}

import { MetadataRoute } from 'next'
import { getAllReviews, getAllComparisons } from '@/lib/content'
import { getAllCompanies } from '@/lib/companies'

const BASE_URL = 'https://www.bestthingreview.com'

const CATEGORIES = ['tech', 'home', 'business', 'lifestyle', 'travel'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const reviews = getAllReviews()
  const comparisons = getAllComparisons()

  const allDates = [
    ...reviews.map(r => new Date(r.updatedAt)),
    ...comparisons.map(c => new Date(c.publishedAt)),
  ]
  const latestDate = allDates.length > 0
    ? new Date(Math.max(...allDates.map(d => d.getTime())))
    : new Date('2026-05-27')

  const latestForCategory = (cat: string) => {
    const dates = reviews
      .filter(r => r.category === cat)
      .map(r => new Date(r.updatedAt))
    return dates.length > 0
      ? new Date(Math.max(...dates.map(d => d.getTime())))
      : latestDate
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: latestDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date('2026-05-27'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/company-review`,
      lastModified: latestDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...CATEGORIES.map(cat => ({
      url: `${BASE_URL}/${cat}`,
      lastModified: latestForCategory(cat),
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
    lastModified: new Date(c.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const companies = getAllCompanies()
  const companyRoutes: MetadataRoute.Sitemap = companies.map(c => ({
    url: `${BASE_URL}/company-review/${c.slug}`,
    lastModified: latestDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...reviewRoutes, ...comparisonRoutes, ...companyRoutes]
}

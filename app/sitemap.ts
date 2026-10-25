import { MetadataRoute } from 'next'
import { getAllReviews, getAllComparisons } from '@/lib/content'
import { getAllDeals } from '@/lib/deals'

const BASE_URL = 'https://www.bestthingreview.com'

const CATEGORIES = ['tech', 'home', 'business', 'lifestyle', 'travel'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const reviews = getAllReviews()
  const comparisons = getAllComparisons()
  const deals = getAllDeals()

  const allDates = [
    ...reviews.map(r => new Date(r.updatedAt)),
    ...comparisons.map(c => new Date(c.publishedAt)),
    ...deals.map(d => new Date(d.updatedAt)),
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
    { url: BASE_URL, lastModified: latestDate },
    { url: `${BASE_URL}/about`, lastModified: new Date('2026-06-10') },
    { url: `${BASE_URL}/editorial-policy`, lastModified: new Date('2026-06-10') },
    { url: `${BASE_URL}/privacy`, lastModified: new Date('2026-06-10') },
    { url: `${BASE_URL}/contact`, lastModified: new Date('2026-05-27') },
    { url: `${BASE_URL}/company-review`, lastModified: latestDate },
    ...CATEGORIES.map(cat => ({
      url: `${BASE_URL}/${cat}`,
      lastModified: latestForCategory(cat),
    })),
  ]

  const reviewRoutes: MetadataRoute.Sitemap = reviews.filter(r => !r.noindex).map(review => ({
    url: `${BASE_URL}/${review.category}/${review.slug}`,
    lastModified: new Date(review.updatedAt),
  }))

  const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map(c => ({
    url: `${BASE_URL}/compare/${c.slug}`,
    lastModified: new Date(c.publishedAt),
  }))

  // Individual /company-review/* pages are noindex, so they stay out of the sitemap

  const dealRoutes: MetadataRoute.Sitemap = deals.map(d => ({
    url: `${BASE_URL}/deals/${d.slug}`,
    lastModified: new Date(d.updatedAt),
  }))

  const dealIndexRoute: MetadataRoute.Sitemap = deals.length > 0 ? [{
    url: `${BASE_URL}/deals`,
    lastModified: new Date(Math.max(...deals.map(d => new Date(d.updatedAt).getTime()))),
  }] : []

  return [...staticRoutes, ...reviewRoutes, ...comparisonRoutes, ...dealIndexRoute, ...dealRoutes]
}

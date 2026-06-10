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

  const reviewRoutes: MetadataRoute.Sitemap = reviews.map(review => ({
    url: `${BASE_URL}/${review.category}/${review.slug}`,
    lastModified: new Date(review.updatedAt),
  }))

  const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map(c => ({
    url: `${BASE_URL}/compare/${c.slug}`,
    lastModified: new Date(c.publishedAt),
  }))

  const companies = getAllCompanies()
  const reviewsBySlug = Object.fromEntries(
    reviews.map(r => [`${r.category}/${r.slug}`, r])
  )
  const companyRoutes: MetadataRoute.Sitemap = companies.map(c => {
    const sourceReview = reviewsBySlug[`${c.sourceArticle.category}/${c.sourceArticle.slug}`]
    return {
      url: `${BASE_URL}/company-review/${c.slug}`,
      lastModified: sourceReview ? new Date(sourceReview.updatedAt) : latestDate,
    }
  })

  return [...staticRoutes, ...reviewRoutes, ...comparisonRoutes, ...companyRoutes]
}

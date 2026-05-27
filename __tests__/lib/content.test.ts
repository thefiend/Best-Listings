import path from 'path'
import {
  getAllReviews,
  getFeaturedReviews,
  getReviewsByCategory,
  getReview,
  getAllComparisons,
  getComparison,
} from '@/lib/content'

const FIXTURE_DIR = path.join(__dirname, '../fixtures')

describe('getAllReviews', () => {
  it('returns all reviews across all categories', () => {
    const reviews = getAllReviews(FIXTURE_DIR)
    expect(reviews).toHaveLength(2)
  })

  it('returns reviews sorted by publishedAt descending', () => {
    const reviews = getAllReviews(FIXTURE_DIR)
    expect(reviews[0].publishedAt).toBe('2024-05-01')
    expect(reviews[1].publishedAt).toBe('2024-03-01')
  })

  it('includes parsed frontmatter fields', () => {
    const reviews = getAllReviews(FIXTURE_DIR)
    const tech = reviews.find(r => r.slug === 'fixture-tech-review')
    expect(tech).toBeDefined()
    expect(tech!.title).toBe('Fixture Tech Review')
    expect(tech!.rating).toBe(9.0)
    expect(tech!.featured).toBe(true)
  })
})

describe('getFeaturedReviews', () => {
  it('returns only featured reviews', () => {
    const featured = getFeaturedReviews(FIXTURE_DIR)
    expect(featured).toHaveLength(1)
    expect(featured[0].slug).toBe('fixture-tech-review')
  })
})

describe('getReviewsByCategory', () => {
  it('returns reviews matching the category', () => {
    const reviews = getReviewsByCategory('tech', FIXTURE_DIR)
    expect(reviews).toHaveLength(1)
    expect(reviews[0].category).toBe('tech')
  })

  it('returns empty array for category with no reviews', () => {
    const reviews = getReviewsByCategory('travel', FIXTURE_DIR)
    expect(reviews).toHaveLength(0)
  })
})

describe('getReview', () => {
  it('returns the matching review', () => {
    const review = getReview('tech', 'fixture-tech-review', FIXTURE_DIR)
    expect(review).toBeDefined()
    expect(review!.title).toBe('Fixture Tech Review')
  })

  it('returns undefined for unknown slug', () => {
    const review = getReview('tech', 'does-not-exist', FIXTURE_DIR)
    expect(review).toBeUndefined()
  })
})

describe('getAllComparisons', () => {
  it('returns all comparisons', () => {
    const comparisons = getAllComparisons(FIXTURE_DIR)
    expect(comparisons).toHaveLength(1)
    expect(comparisons[0].slug).toBe('fixture-comparison')
  })

  it('includes products array', () => {
    const comparisons = getAllComparisons(FIXTURE_DIR)
    expect(comparisons[0].products).toHaveLength(2)
    expect(comparisons[0].products[0].name).toBe('Product A')
  })
})

describe('getComparison', () => {
  it('returns the matching comparison', () => {
    const comp = getComparison('fixture-comparison', FIXTURE_DIR)
    expect(comp).toBeDefined()
    expect(comp!.title).toBe('Fixture Comparison')
  })

  it('returns undefined for unknown slug', () => {
    const comp = getComparison('no-such-slug', FIXTURE_DIR)
    expect(comp).toBeUndefined()
  })
})

/**
 * @jest-environment node
 */
import { GET } from '@/app/api/search/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/content', () => ({
  getAllReviews: () => [
    {
      title: 'Best Laptops 2024',
      slug: 'best-laptops-2024',
      category: 'tech',
      excerpt: 'Top picks for every budget',
      rating: 8.5,
      featured: true,
      publishedAt: '2024-05-01',
      updatedAt: '2024-05-15',
      content: '',
    },
    {
      title: 'Best Robot Vacuums',
      slug: 'best-robot-vacuums',
      category: 'home',
      excerpt: 'Hands-free cleaning tested',
      rating: 7.8,
      featured: false,
      publishedAt: '2024-03-01',
      updatedAt: '2024-03-15',
      content: '',
    },
  ],
  getAllComparisons: () => [
    {
      title: 'Laptop Comparison',
      slug: 'laptop-comparison',
      category: 'tech',
      products: [],
      publishedAt: '2024-04-01',
      content: '',
    },
  ],
}))

function req(q: string) {
  return new NextRequest(`http://localhost/api/search?q=${encodeURIComponent(q)}`)
}

test('returns [] for empty query', async () => {
  const res = await GET(req(''))
  expect(await res.json()).toEqual([])
})

test('returns [] for single-char query', async () => {
  const res = await GET(req('a'))
  expect(await res.json()).toEqual([])
})

test('matches review by title', async () => {
  const res = await GET(req('laptop'))
  const data = await res.json()
  expect(data.some((r: { title: string }) => r.title === 'Best Laptops 2024')).toBe(true)
})

test('matches review by excerpt', async () => {
  const res = await GET(req('hands-free'))
  const data = await res.json()
  expect(data).toHaveLength(1)
  expect(data[0].title).toBe('Best Robot Vacuums')
})

test('matches by category', async () => {
  const res = await GET(req('home'))
  const data = await res.json()
  expect(data).toHaveLength(1)
  expect(data[0].category).toBe('home')
})

test('is case-insensitive', async () => {
  const res = await GET(req('LAPTOP'))
  const data = await res.json()
  expect(data.length).toBeGreaterThan(0)
})

test('includes comparisons in results', async () => {
  const res = await GET(req('laptop'))
  const data = await res.json()
  expect(data.some((r: { type: string }) => r.type === 'comparison')).toBe(true)
})

test('review result has correct shape', async () => {
  const res = await GET(req('vacuum'))
  const data = await res.json()
  expect(data[0]).toMatchObject({
    type: 'review',
    title: expect.any(String),
    slug: expect.any(String),
    category: expect.any(String),
    excerpt: expect.any(String),
    rating: expect.any(Number),
  })
})

test('comparison result omits excerpt and rating', async () => {
  const res = await GET(req('comparison'))
  const data = await res.json()
  const comp = data.find((r: { type: string }) => r.type === 'comparison')
  expect(comp).toBeDefined()
  expect(comp.excerpt).toBeUndefined()
  expect(comp.rating).toBeUndefined()
})

test('limits results to 8', async () => {
  const res = await GET(req('best'))
  const data = await res.json()
  expect(data.length).toBeLessThanOrEqual(8)
})

test('returns [] for whitespace-only query', async () => {
  const res = await GET(req('  '))
  expect(await res.json()).toEqual([])
})

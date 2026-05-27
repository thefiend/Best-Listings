import { render, screen } from '@testing-library/react'
import { ReviewCard } from '@/components/review-card'
import { Review } from '@/lib/types'

const mockReview: Review = {
  title: 'Best Laptops 2024',
  category: 'tech',
  slug: 'best-laptops-2024',
  excerpt: 'After testing 24 laptops...',
  rating: 9.2,
  featured: true,
  publishedAt: '2024-05-01',
  updatedAt: '2024-05-15',
  content: '',
}

test('renders review title', () => {
  render(<ReviewCard review={mockReview} />)
  expect(screen.getByText('Best Laptops 2024')).toBeInTheDocument()
})

test('renders excerpt', () => {
  render(<ReviewCard review={mockReview} />)
  expect(screen.getByText('After testing 24 laptops...')).toBeInTheDocument()
})

test('renders rating badge', () => {
  render(<ReviewCard review={mockReview} />)
  expect(screen.getByText(/9\.2/)).toBeInTheDocument()
})

test('renders category badge', () => {
  render(<ReviewCard review={mockReview} />)
  expect(screen.getByText('Tech')).toBeInTheDocument()
})

test('links to the review page', () => {
  render(<ReviewCard review={mockReview} />)
  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('href', '/tech/best-laptops-2024')
})

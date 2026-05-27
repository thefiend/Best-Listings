import { render, screen } from '@testing-library/react'
import { CategoryBadge } from '@/components/category-badge'

test('renders Tech label for tech category', () => {
  render(<CategoryBadge category="tech" />)
  expect(screen.getByText('Tech')).toBeInTheDocument()
})

test('renders Home label for home category', () => {
  render(<CategoryBadge category="home" />)
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('renders Software label for software category', () => {
  render(<CategoryBadge category="software" />)
  expect(screen.getByText('Software')).toBeInTheDocument()
})

test('renders Lifestyle label for lifestyle category', () => {
  render(<CategoryBadge category="lifestyle" />)
  expect(screen.getByText('Lifestyle')).toBeInTheDocument()
})

test('renders Travel label for travel category', () => {
  render(<CategoryBadge category="travel" />)
  expect(screen.getByText('Travel')).toBeInTheDocument()
})

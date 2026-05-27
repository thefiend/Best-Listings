import { render, screen } from '@testing-library/react'
import { RatingBadge } from '@/components/rating-badge'

test('displays score with one decimal place', () => {
  render(<RatingBadge score={9.2} />)
  expect(screen.getByText('9.2')).toBeInTheDocument()
})

test('displays whole number scores with one decimal', () => {
  render(<RatingBadge score={9} />)
  expect(screen.getByText('9.0')).toBeInTheDocument()
})

test('displays star symbol', () => {
  render(<RatingBadge score={8.5} />)
  expect(screen.getByText(/★/)).toBeInTheDocument()
})

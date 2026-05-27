import { render, screen } from '@testing-library/react'
import { ScoreBreakdown } from '@/components/score-breakdown'

const dimensions = [
  { label: 'Performance', score: 9.5 },
  { label: 'Battery', score: 9.0 },
]

test('renders top pick name', () => {
  render(<ScoreBreakdown topPick="MacBook Air M3" dimensions={dimensions} />)
  expect(screen.getByText('MacBook Air M3')).toBeInTheDocument()
})

test('renders all dimension labels', () => {
  render(<ScoreBreakdown topPick="Test" dimensions={dimensions} />)
  expect(screen.getByText('Performance')).toBeInTheDocument()
  expect(screen.getByText('Battery')).toBeInTheDocument()
})

test('renders dimension scores', () => {
  render(<ScoreBreakdown topPick="Test" dimensions={dimensions} />)
  expect(screen.getByText('9.5')).toBeInTheDocument()
  expect(screen.getByText('9.0')).toBeInTheDocument()
})

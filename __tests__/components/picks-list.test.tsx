import { render, screen } from '@testing-library/react'
import { PicksList } from '@/components/picks-list'
import { ReviewPick } from '@/lib/types'

const picks: ReviewPick[] = [
  { rank: 1, name: 'MacBook Air M3', score: 9.2, label: 'Best Overall' },
  { rank: 2, name: 'Dell XPS 15', score: 8.8, label: 'Best Windows' },
]

test('renders all pick names', () => {
  render(<PicksList picks={picks} />)
  expect(screen.getByText('MacBook Air M3')).toBeInTheDocument()
  expect(screen.getByText('Dell XPS 15')).toBeInTheDocument()
})

test('renders labels', () => {
  render(<PicksList picks={picks} />)
  expect(screen.getByText('Best Overall')).toBeInTheDocument()
  expect(screen.getByText('Best Windows')).toBeInTheDocument()
})

test('renders scores', () => {
  render(<PicksList picks={picks} />)
  expect(screen.getByText(/9\.2/)).toBeInTheDocument()
  expect(screen.getByText(/8\.8/)).toBeInTheDocument()
})

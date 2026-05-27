import { render, screen } from '@testing-library/react'
import { ComparisonTable } from '@/components/comparison-table'

const headers = ['Model', 'Price', 'Score']
const rows = [
  ['MacBook Air M3', '$1,099', '9.2'],
  ['Dell XPS 15', '$1,299', '8.8'],
]

test('renders all headers', () => {
  render(<ComparisonTable headers={headers} rows={rows} />)
  expect(screen.getByText('Model')).toBeInTheDocument()
  expect(screen.getByText('Price')).toBeInTheDocument()
  expect(screen.getByText('Score')).toBeInTheDocument()
})

test('renders all row data', () => {
  render(<ComparisonTable headers={headers} rows={rows} />)
  expect(screen.getByText('MacBook Air M3')).toBeInTheDocument()
  expect(screen.getByText('$1,299')).toBeInTheDocument()
})

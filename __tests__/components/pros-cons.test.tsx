import { render, screen } from '@testing-library/react'
import { ProsCons } from '@/components/pros-cons'

test('renders all pros', () => {
  render(<ProsCons pros={['Fast', 'Cheap']} cons={['Heavy']} />)
  expect(screen.getByText('Fast')).toBeInTheDocument()
  expect(screen.getByText('Cheap')).toBeInTheDocument()
})

test('renders all cons', () => {
  render(<ProsCons pros={['Fast']} cons={['Heavy', 'Loud']} />)
  expect(screen.getByText('Heavy')).toBeInTheDocument()
  expect(screen.getByText('Loud')).toBeInTheDocument()
})

test('renders Pros and Cons headings', () => {
  render(<ProsCons pros={['a']} cons={['b']} />)
  expect(screen.getByText('Pros')).toBeInTheDocument()
  expect(screen.getByText('Cons')).toBeInTheDocument()
})

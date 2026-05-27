import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { SearchDropdown } from '@/components/search-dropdown'
import type { SearchResult } from '@/lib/types'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockResults: SearchResult[] = [
  {
    type: 'review',
    title: 'Best Laptops 2024',
    slug: 'best-laptops-2024',
    category: 'tech',
    excerpt: 'Top picks for every budget',
    rating: 8.5,
  },
]

beforeEach(() => {
  jest.useFakeTimers()
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.useRealTimers()
  jest.resetAllMocks()
})

test('renders a search input', () => {
  render(<SearchDropdown />)
  expect(screen.getByRole('combobox')).toBeInTheDocument()
})

test('does not fetch for query shorter than 2 chars', () => {
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'a' } })
  act(() => { jest.advanceTimersByTime(300) })
  expect(global.fetch).not.toHaveBeenCalled()
})

test('does not fetch before 300ms debounce', () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'la' } })
  act(() => { jest.advanceTimersByTime(299) })
  expect(global.fetch).not.toHaveBeenCalled()
})

test('fetches after 300ms debounce', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'la' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/search?q=la'))
})

test('shows results after fetch', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => mockResults })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'laptop' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => expect(screen.getByText('Best Laptops 2024')).toBeInTheDocument())
})

test('shows excerpt truncated to 60 chars', async () => {
  const longExcerpt = 'A'.repeat(70)
  ;(global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => [{ ...mockResults[0], excerpt: longExcerpt }],
  })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'laptop' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => {
    expect(screen.getByText(`${'A'.repeat(60)}…`)).toBeInTheDocument()
  })
})

test('shows no-results message for empty results', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => expect(screen.getByText(/No results for/)).toBeInTheDocument())
})

test('closes dropdown on Escape', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => mockResults })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'laptop' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => expect(screen.getByText('Best Laptops 2024')).toBeInTheDocument())
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
  expect(screen.queryByText('Best Laptops 2024')).not.toBeInTheDocument()
})

test('Enter key navigates to first review result', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => mockResults })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'laptop' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => expect(screen.getByText('Best Laptops 2024')).toBeInTheDocument())
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
  expect(mockPush).toHaveBeenCalledWith('/tech/best-laptops-2024')
})

test('Enter key navigates to first comparison result', async () => {
  const compResult: SearchResult = {
    type: 'comparison',
    title: 'Laptop Comparison',
    slug: 'laptop-comparison',
    category: 'tech',
  }
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [compResult] })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'laptop' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => expect(screen.getByText('Laptop Comparison')).toBeInTheDocument())
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
  expect(mockPush).toHaveBeenCalledWith('/compare/laptop-comparison')
})

test('closes dropdown on click outside', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => mockResults })
  render(
    <div>
      <SearchDropdown />
      <button>Outside</button>
    </div>
  )
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'laptop' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => expect(screen.getByText('Best Laptops 2024')).toBeInTheDocument())
  fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }))
  expect(screen.queryByText('Best Laptops 2024')).not.toBeInTheDocument()
})

test('result link has correct href for review', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => mockResults })
  render(<SearchDropdown />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'laptop' } })
  act(() => { jest.advanceTimersByTime(300) })
  await waitFor(() => expect(screen.getByText('Best Laptops 2024')).toBeInTheDocument())
  expect(screen.getByRole('option', { name: /Best Laptops/i })).toHaveAttribute('href', '/tech/best-laptops-2024')
})

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SearchResult } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  tech: 'Tech',
  home: 'Home',
  business: 'Business',
  lifestyle: 'Lifestyle',
  travel: 'Travel',
}

function resultHref(result: SearchResult): string {
  return result.type === 'review'
    ? `/${result.category}/${result.slug}`
    : `/compare/${result.slug}`
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

interface SearchDropdownProps {
  placeholder?: string
  inputClassName?: string
  dropdownClassName?: string
}

export function SearchDropdown({
  placeholder = 'Search...',
  inputClassName = '',
  dropdownClassName = '',
}: SearchDropdownProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data: SearchResult[] = await res.json()
      setResults(data)
      setOpen(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false)
    }
    if (e.key === 'Enter' && results.length > 0) {
      router.push(resultHref(results[0]))
      setOpen(false)
      setQuery('')
    }
  }

  function handleResultClick() {
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search reviews"
        className={inputClassName}
      />

      {open && (
        <div
          role="listbox"
          aria-label="Search results"
          className={`absolute top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 ${dropdownClassName}`}
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            results.map(result => (
              <Link
                key={`${result.type}-${result.slug}`}
                href={resultHref(result)}
                onClick={handleResultClick}
                className="flex flex-col px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 flex-1 leading-snug">
                    {result.title}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 flex-shrink-0">
                    {CATEGORY_LABELS[result.category] ?? result.category}
                  </span>
                </div>
                {result.excerpt && (
                  <span className="text-xs text-gray-500 mt-0.5">
                    {truncate(result.excerpt, 60)}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

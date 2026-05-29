'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/lib/toc'

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '0% 0% -75% 0%' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        On this page
      </p>
      <nav aria-label="Table of contents">
        <ul className="border-l border-gray-200">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={[
                  'block py-1.5 text-[13px] leading-snug -ml-px border-l-2 transition-all duration-150',
                  level === 3 ? 'pl-5' : 'pl-3',
                  activeId === id
                    ? 'border-brand-blue text-brand-blue font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-400',
                ].join(' ')}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

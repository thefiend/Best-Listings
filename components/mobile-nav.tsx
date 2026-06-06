'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/tech',      label: 'Tech & Gadgets', emoji: '⚡' },
  { href: '/home',      label: 'Home & Living',  emoji: '🏠' },
  { href: '/business',  label: 'Business',        emoji: '💼' },
  { href: '/lifestyle', label: 'Lifestyle',       emoji: '✨' },
  { href: '/travel',    label: 'Travel',          emoji: '✈️' },
  { href: '/company-review', label: 'Company Reviews', emoji: '🏢' },
  { href: '/contact',   label: 'Contact Us',      emoji: '✉️' },
]

export function MobileNavButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Open menu"
      className="md:hidden flex items-center justify-center w-9 h-9 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <rect y="3"  width="20" height="2" rx="1" />
        <rect y="9"  width="20" height="2" rx="1" />
        <rect y="15" width="20" height="2" rx="1" />
      </svg>
    </button>
  )
}

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <MobileNavButton onOpen={() => setOpen(true)} />

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-brand-navy text-white flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 flex-shrink-0">
          <span className="text-brand-gold font-bold text-base">BestThingReview</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex items-center justify-center w-8 h-8 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.22 2.22a.75.75 0 0 1 1.06 0L8 6.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L9.06 8l4.72 4.72a.75.75 0 1 1-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {LINKS.map(({ href, label, emoji }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-white/10 ${
                pathname === href || pathname.startsWith(href + '/')
                  ? 'text-white bg-white/10'
                  : 'text-white/75'
              }`}
            >
              <span className="text-base w-6 text-center">{emoji}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

// components/nav.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/lib/types'
import { MobileNavDrawer } from './mobile-nav'
import { SearchDropdown } from './search-dropdown'

const CATEGORIES: Category[] = ['tech', 'home', 'business', 'lifestyle', 'travel']
const CATEGORY_LABELS: Record<Category, string> = {
  tech: 'Tech',
  home: 'Home',
  business: 'Business',
  lifestyle: 'Lifestyle',
  travel: 'Travel',
}

export function Nav() {
  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="BestThingReview"
            width={180}
            height={36}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/${cat}`}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
          <Link href="/contact" className="text-sm text-white/80 hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        <div className="hidden lg:block">
          <SearchDropdown
            placeholder="Search..."
            inputClassName="w-44 px-3 py-1.5 text-sm rounded bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/40"
            dropdownClassName="w-72"
          />
        </div>

        <MobileNavDrawer />
      </div>
    </nav>
  )
}

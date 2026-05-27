// components/footer.tsx
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'tech', label: 'Tech' },
  { slug: 'home', label: 'Home' },
  { slug: 'business', label: 'Business' },
  { slug: 'lifestyle', label: 'Lifestyle' },
  { slug: 'travel', label: 'Travel' },
]

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white/70 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-brand-gold font-bold text-lg">BestThingReview</p>
            <p className="text-sm mt-1 max-w-xs">
              Honest, research-driven reviews to help you make confident buying decisions.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Categories</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {CATEGORIES.map(({ slug, label }) => (
                <li key={slug}>
                  <Link href={`/${slug}`} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Company</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-xs mt-8 text-white/40">
          © {new Date().getFullYear()} BestThingReview.com · All rights reserved
        </p>
      </div>
    </footer>
  )
}

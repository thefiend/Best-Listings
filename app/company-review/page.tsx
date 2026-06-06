// app/company-review/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllCompanies } from '@/lib/companies'

export const metadata: Metadata = {
  title: 'Company Reviews — Singapore Business Directory',
  description: 'Independent reviews of Singapore businesses ranked by Google rating, review volume, and verified client outcomes.',
  alternates: { canonical: 'https://www.bestthingreview.com/company-review' },
}

export default function CompanyReviewIndex() {
  const companies = getAllCompanies()

  const byType = companies.reduce<Record<string, typeof companies>>((acc, c) => {
    const key = c.sourceArticle.title
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">Company Reviews</h1>
      <p className="text-gray-500 text-sm mb-8">
        {companies.length} Singapore businesses reviewed and ranked independently.
      </p>

      <div className="space-y-10">
        {Object.entries(byType).map(([articleTitle, list]) => (
          <section key={articleTitle}>
            <h2 className="text-base font-semibold text-brand-navy mb-3 border-b border-gray-100 pb-2">
              {articleTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {list.map(c => (
                <Link
                  key={c.slug}
                  href={`/company-review/${c.slug}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:border-brand-blue hover:bg-blue-50 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-brand-blue truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400">{c.label}</p>
                  </div>
                  <span className="ml-3 flex-shrink-0 text-xs font-bold bg-brand-gold text-brand-navy px-1.5 py-0.5 rounded">
                    {c.rating.toFixed(1)} ★
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

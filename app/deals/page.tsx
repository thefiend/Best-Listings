import type { Metadata } from 'next'
import { getAllDeals } from '@/lib/deals'
import { DealCard } from '@/components/deal-card'

const BASE_URL = 'https://www.bestthingreview.com'

export const metadata: Metadata = {
  title: 'Singapore Promo Codes & Referral Codes (2026)',
  description: 'Verified promo codes, referral bonuses, and discount codes for Singapore services and investment platforms.',
  alternates: { canonical: `${BASE_URL}/deals` },
}

export default function DealsPage() {
  const deals = getAllDeals()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="border-l-4 border-brand-green pl-4 mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">Singapore Promo Codes & Referral Codes</h1>
        <p className="text-gray-500 text-sm mt-1">
          {deals.length} merchant{deals.length !== 1 ? 's' : ''} · Verified discount codes and referral bonuses for Singapore
        </p>
      </div>

      {deals.length === 0 ? (
        <p className="text-gray-500 text-sm">No deals yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deals.map((deal, i) => (
            <DealCard key={deal.slug} deal={deal} preload={i === 0} />
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-10">
        This page contains affiliate and referral links. We may earn a commission at no extra cost to you.
      </p>
    </div>
  )
}

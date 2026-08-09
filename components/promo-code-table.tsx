// components/promo-code-table.tsx
import { PromoCode } from '@/lib/types'
import { CopyCodeButton } from './copy-code-button'

interface PromoCodeTableProps {
  codes: PromoCode[]
}

function getExpiryStatus(expires: string): 'expired' | 'expiring-soon' | 'valid' {
  const expiryDate = new Date(expires)
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  if (expiryDate < now) return 'expired'
  if (expiryDate <= sevenDaysFromNow) return 'expiring-soon'
  return 'valid'
}

function formatExpiry(expires: string): string {
  return new Date(expires).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function PromoCodeTable({ codes }: PromoCodeTableProps) {
  if (!codes || codes.length === 0) return null

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Code</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Discount</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Expires</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {codes.map((promo, i) => {
            const status = getExpiryStatus(promo.expires)
            const isFirst = i === 0

            return (
              <tr
                key={promo.code}
                className={`border-b border-gray-100 last:border-0 ${
                  isFirst ? 'bg-green-50' : 'bg-white'
                } ${status === 'expired' ? 'opacity-50' : ''}`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold tracking-wider px-3 py-1.5 rounded border-2 border-dashed text-sm ${
                      status === 'expired'
                        ? 'border-gray-300 text-gray-400 line-through'
                        : isFirst
                        ? 'border-brand-green text-brand-navy bg-white'
                        : 'border-gray-300 text-gray-700 bg-white'
                    }`}>
                      {promo.code}
                    </span>
                    {status !== 'expired' && <CopyCodeButton code={promo.code} />}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-700 font-medium">{promo.discount}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    status === 'expired'
                      ? 'bg-red-100 text-red-600'
                      : status === 'expiring-soon'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {status === 'expired' ? 'Expired' : formatExpiry(promo.expires)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  {status !== 'expired' && (
                    <a
                      href={promo.affiliateUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isFirst
                          ? 'bg-brand-navy text-white hover:bg-brand-blue'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Get Deal
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                        <path d="M3.5 3a.5.5 0 0 0 0 1H7.29L2.15 9.15a.5.5 0 1 0 .7.7L8 4.71V8.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5h-5Z" />
                      </svg>
                    </a>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

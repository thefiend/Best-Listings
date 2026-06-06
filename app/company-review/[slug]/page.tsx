// app/company-review/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllCompanies, getCompany } from '@/lib/companies'

const BASE_URL = 'https://www.bestthingreview.com'
const PUBLISHED_DATE = '2026-05-27'

export const dynamicParams = false

export async function generateStaticParams() {
  return getAllCompanies().map(c => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = getCompany(slug)
  if (!company) return {}

  const { name, label, services, description, address } = company
  const year = new Date().getFullYear()
  const location = address ? 'Singapore' : ''
  const serviceSnippet = services.slice(0, 2).join(' & ')

  // Keyword-rich title: Name — Services Label | Brand
  const title = serviceSnippet
    ? `${name} — ${serviceSnippet} | ${label} ${year}`
    : `${name} Review & Rating ${year} | ${label}`

  // Full first sentence for description
  const firstSentence = description.match(/^[^.!?]+[.!?]/)?.[0] ?? description.slice(0, 155)
  const descSuffix = location ? ` Based in ${location}.` : ''
  const metaDesc = (firstSentence + descSuffix).slice(0, 160)

  const url = `${BASE_URL}/company-review/${slug}`

  return {
    title,
    description: metaDesc,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description: metaDesc,
      publishedTime: PUBLISHED_DATE,
    },
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)))
        return (
          <span key={i} className={fill >= 0.75 ? 'text-yellow-400' : fill >= 0.25 ? 'text-yellow-300' : 'text-gray-300'}>
            ★
          </span>
        )
      })}
    </span>
  )
}

function bestForStatement(label: string, services: string[]): string {
  const clean = label.replace(/^Best\s+/i, '').replace(/^for\s+/i, '')
  if (services.length > 0) {
    return `${name} is best for ${clean.toLowerCase()} needing ${services.slice(0, 2).join(' or ').toLowerCase()} services in Singapore.`
  }
  return `${name} is best for ${clean.toLowerCase()} in Singapore.`
}

export default async function CompanyReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const company = getCompany(slug)
  if (!company) notFound()

  const {
    name, businessType, rating, reviewCount,
    address, postalCode, phone, email, website,
    description, reviewQuote, reviewerName,
    highlights, services,
    label, rank, sourceArticle,
  } = company

  const pageUrl = `${BASE_URL}/company-review/${slug}`
  const year = new Date().getFullYear()

  // Related companies from same article (excluding self, max 4)
  const related = getAllCompanies()
    .filter(c => c.sourceArticle.slug === sourceArticle.slug && c.slug !== slug)
    .slice(0, 4)

  // Verdict: rank-based qualifier + label
  const rankLabel = rank === 1 ? 'top-ranked' : rank <= 3 ? 'top-3 ranked' : `#${rank} ranked`
  const verdictText = `${name} is the ${rankLabel} ${label.toLowerCase()} on BestThingReview's independent evaluation of ${sourceArticle.title.replace(/^\d+\s+Best\s+/i, '')}. ${description.split('. ').slice(0, 2).join('. ')}.`

  // Schema
  const businessSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': businessType,
    '@id': `${pageUrl}/#business`,
    name,
    ...(website ? { url: website, sameAs: [website] } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(address || postalCode ? {
      address: {
        '@type': 'PostalAddress',
        ...(address ? { streetAddress: address } : {}),
        addressLocality: 'Singapore',
        ...(postalCode ? { postalCode } : {}),
        addressCountry: 'SG',
      },
    } : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      ratingCount: reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    ...(services.length > 0 ? {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${name} Services`,
        itemListElement: services.map((s, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: { '@type': 'Service', name: s },
        })),
      },
    } : {}),
    review: {
      '@type': 'Review',
      datePublished: PUBLISHED_DATE,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating.toFixed(1),
        bestRating: '5',
      },
      author: {
        '@type': 'Organization',
        name: 'BestThingReview',
        url: BASE_URL,
      },
      reviewBody: verdictText,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Company Reviews', item: `${BASE_URL}/company-review` },
      { '@type': 'ListItem', position: 3, name: name },
    ],
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <span>/</span>
        <Link href="/company-review" className="hover:text-brand-blue">Company Reviews</Link>
        <span>/</span>
        <span className="text-gray-600">{name}</span>
      </nav>

      {/* Header */}
      <div className="border-l-4 border-brand-green pl-4 mb-8">
        <p className="text-xs font-semibold text-brand-green uppercase tracking-wide mb-1">
          #{rank} {label}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-navy leading-tight mb-3">
          {name}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <StarRating rating={rating} />
          <span className="text-lg font-bold text-gray-900">{rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">
            {reviewCount.toLocaleString()} Google reviews
          </span>
        </div>
      </div>

      {/* Contact details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8 space-y-2 text-sm">
        {address && (
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Address:</span>{' '}
            {address}{postalCode ? `, Singapore ${postalCode}` : ''}
          </p>
        )}
        {phone && (
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Phone:</span>{' '}
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-brand-blue hover:underline">{phone}</a>
          </p>
        )}
        {email && (
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Email:</span>{' '}
            <a href={`mailto:${email}`} className="text-brand-blue hover:underline">{email}</a>
          </p>
        )}
        {website && (
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Website:</span>{' '}
            <a href={website} target="_blank" rel="nofollow noopener noreferrer" className="text-brand-blue hover:underline">
              {website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </p>
        )}
      </div>

      {/* About */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-brand-navy mb-3">About {name}</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-brand-navy mb-3">Highlights</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {highlights.map(h => (
              <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-brand-navy mb-3">Services</h2>
          <div className="flex flex-wrap gap-2">
            {services.map(s => (
              <span key={s} className="px-3 py-1 text-sm rounded-full bg-blue-50 text-brand-blue border border-blue-100 font-medium">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Customer Review */}
      {reviewQuote && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-brand-navy mb-3">Customer Review</h2>
          <blockquote className="border-l-4 border-brand-gold bg-amber-50 pl-4 pr-4 py-4 rounded-r-lg">
            <p className="text-gray-800 italic leading-relaxed">"{reviewQuote}"</p>
            {reviewerName && (
              <footer className="mt-2 text-sm text-gray-500">— {reviewerName}</footer>
            )}
          </blockquote>
        </section>
      )}

      {/* Our Verdict */}
      <section className="mb-8 bg-emerald-50 border border-emerald-200 rounded-lg p-5">
        <h2 className="text-lg font-bold text-brand-navy mb-2">Our Verdict</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{verdictText}</p>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-brand-navy">{rating.toFixed(1)}</p>
            <StarRating rating={rating} />
            <p className="text-xs text-gray-500 mt-0.5">/ 5.0 Google</p>
          </div>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p><strong>{reviewCount.toLocaleString()}</strong> verified Google reviews</p>
            <p>Ranked <strong>#{rank}</strong> in Singapore {year}</p>
            <p className="text-xs text-gray-400">Source: Google Maps · Reviewed by BestThingReview</p>
          </div>
        </div>
      </section>

      {/* Best For */}
      <section className="mb-8 border border-gray-200 rounded-lg p-5">
        <h2 className="text-lg font-bold text-brand-navy mb-3">Best For</h2>
        <div className="flex items-start gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{label}</p>
            <p className="text-sm text-gray-600 mt-1">
              {label.toLowerCase().includes('overall')
                ? `${name} is our top overall pick — balancing rating, review volume, transparency, and service range.`
                : `${name} stands out specifically for ${label.replace(/^Best\s+(for\s+)?/i, '').toLowerCase()}, making it the strongest choice for customers with this priority.`
              }
            </p>
          </div>
        </div>
      </section>

      {/* Source article */}
      <section className="border-t border-gray-100 pt-6 mb-8">
        <p className="text-sm text-gray-500 mb-2">
          {name} is ranked #{rank} in our independent evaluation:
        </p>
        <Link
          href={`/${sourceArticle.category}/${sourceArticle.slug}`}
          className="inline-flex items-center gap-2 text-brand-blue hover:underline font-medium text-sm"
        >
          {sourceArticle.title} →
        </Link>
      </section>

      {/* Related companies */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-base font-bold text-brand-navy mb-4">
            Also Ranked in {sourceArticle.title.replace(/^\d+\s+/i, '')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map(c => (
              <Link
                key={c.slug}
                href={`/company-review/${c.slug}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-brand-blue hover:bg-blue-50 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-brand-blue truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">#{c.rank} {c.label}</p>
                </div>
                <span className="ml-3 flex-shrink-0 text-xs font-bold bg-brand-gold text-brand-navy px-1.5 py-0.5 rounded">
                  {c.rating.toFixed(1)} ★
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

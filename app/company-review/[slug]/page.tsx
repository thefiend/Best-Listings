// app/company-review/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllCompanies, getCompany } from '@/lib/companies'

const BASE_URL = 'https://www.bestthingreview.com'

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

  const title = `${company.name} Review & Rating (${new Date().getFullYear()})`
  const description = company.description.slice(0, 155).trimEnd() + '…'
  const url = `${BASE_URL}/company-review/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
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

  // LocalBusiness schema with AggregateRating + Review
  const businessSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': businessType,
    '@id': `${pageUrl}/#business`,
    name,
    ...(website ? { url: website } : {}),
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
    ...(reviewQuote ? {
      review: {
        '@type': 'Review',
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
        reviewBody: description,
      },
    } : {}),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
            <a
              href={website}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              {website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </p>
        )}
      </div>

      {/* Description */}
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
              <span
                key={s}
                className="px-3 py-1 text-sm rounded-full bg-blue-50 text-brand-blue border border-blue-100 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Customer review quote */}
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

      {/* Rating breakdown */}
      <section className="mb-8 bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-lg font-bold text-brand-navy mb-4">Rating Summary</h2>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-brand-navy">{rating.toFixed(1)}</p>
            <StarRating rating={rating} />
            <p className="text-xs text-gray-500 mt-1">out of 5</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>Based on <strong>{reviewCount.toLocaleString()}</strong> Google reviews</p>
            <p className="mt-1">Source: Google Maps</p>
          </div>
        </div>
      </section>

      {/* Source article link */}
      <section className="border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500 mb-2">
          {name} is ranked #{rank} in our independent review:
        </p>
        <Link
          href={`/${sourceArticle.category}/${sourceArticle.slug}`}
          className="inline-flex items-center gap-2 text-brand-blue hover:underline font-medium text-sm"
        >
          {sourceArticle.title} →
        </Link>
      </section>
    </div>
  )
}

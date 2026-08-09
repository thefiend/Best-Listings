// app/deals/[slug]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { getAllDeals, getDeal } from '@/lib/deals'
import { mdxComponents } from '@/lib/mdx-components'
import { extractHeadings } from '@/lib/toc'
import { TableOfContents } from '@/components/table-of-contents'
import { PromoCodeTable } from '@/components/promo-code-table'

const BASE_URL = 'https://www.bestthingreview.com'

async function MDXContent({ source }: { source: string }) {
  const code = await compile(source, { outputFormat: 'function-body' })
  const { default: Content } = await run(String(code), {
    ...runtime,
    baseUrl: import.meta.url,
  }) as { default: React.ComponentType<{ components: Record<string, React.ComponentType> }> }
  return <Content components={mdxComponents as Record<string, React.ComponentType>} />
}

export const dynamicParams = false

export async function generateStaticParams() {
  const deals = getAllDeals()
  return deals.map(d => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const deal = getDeal(slug)
  if (!deal) return {}

  const canonicalUrl = `${BASE_URL}/deals/${deal.slug}`
  const firstCode = deal.codes[0]?.code ?? ''

  return {
    title: `${deal.merchant} Promo Code Singapore — ${firstCode}`,
    description: deal.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: `${deal.merchant} Promo Code Singapore — ${firstCode}`,
      description: deal.excerpt,
      publishedTime: deal.publishedAt,
      modifiedTime: deal.updatedAt,
      ...(deal.coverImage ? { images: [deal.coverImage] } : {}),
    },
    twitter: deal.coverImage
      ? { card: 'summary_large_image', images: [deal.coverImage] }
      : undefined,
  }
}

export default async function DealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const deal = getDeal(slug)
  if (!deal) notFound()

  const { title, excerpt, merchant, merchantUrl, publishedAt, updatedAt, content, coverImage, codes } = deal

  const canonicalUrl = `${BASE_URL}/deals/${slug}`

  const updateDate = new Date(updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const now = new Date()
  const activeCodes = codes.filter(c => new Date(c.expires) >= now).length

  const headings = extractHeadings(content)

  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonicalUrl}#article`,
        headline: title,
        description: excerpt,
        datePublished: publishedAt,
        dateModified: updatedAt,
        url: canonicalUrl,
        ...(coverImage ? {
          image: {
            '@type': 'ImageObject',
            url: `${BASE_URL}${coverImage}`,
            width: 1200,
            height: 628,
          },
        } : {}),
        publisher: { '@id': `${BASE_URL}/#organization` },
        author: { '@id': `${BASE_URL}/#organization` },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Deals', item: `${BASE_URL}/deals` },
          { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
        ],
      },
    ],
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <span>/</span>
        <Link href="/deals" className="hover:text-brand-blue">Deals</Link>
        <span>/</span>
        <span className="text-gray-600 truncate">{title}</span>
      </nav>

      {/* Title block */}
      <div className="border-l-4 border-brand-green pl-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-green">Deals</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {activeCodes} active code{activeCodes !== 1 ? 's' : ''}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-navy leading-tight">{title}</h1>
        <p className="text-gray-500 text-sm mt-2">
          Updated {updateDate} ·{' '}
          <a
            href={merchantUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-brand-blue hover:underline"
          >
            {merchant} official site
          </a>
        </p>
      </div>

      {/* Cover image */}
      {coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            width={1200}
            height={628}
            className="w-full h-auto"
            priority
          />
        </div>
      )}

      {/* Excerpt */}
      <p className="text-gray-600 text-base leading-relaxed mb-6 border-b border-gray-100 pb-6">
        {excerpt}
      </p>

      {/* Promo code table — always rendered from frontmatter */}
      <PromoCodeTable codes={codes} />

      {/* MDX body + TOC sidebar */}
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12 mt-8">
        <article className="prose prose-gray prose-headings:text-brand-navy prose-a:text-brand-blue max-w-none min-w-0">
          <MDXContent source={content} />
        </article>

        <aside className="hidden lg:block">
          <TableOfContents headings={headings} />
        </aside>
      </div>

      {/* Affiliate disclosure */}
      <div className="mt-12 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          <strong>Affiliate disclosure:</strong> This page contains affiliate and referral links. We may earn a commission at no extra cost to you. Codes are verified at time of publication — always check the merchant site for current terms.
        </p>
      </div>
    </div>
  )
}

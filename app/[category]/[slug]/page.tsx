// app/[category]/[slug]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { getAllReviews, getReview } from '@/lib/content'
import { Category } from '@/lib/types'
import { RatingBadge } from '@/components/rating-badge'
import { CategoryBadge } from '@/components/category-badge'
import { mdxComponents } from '@/lib/mdx-components'
import { extractHeadings } from '@/lib/toc'
import { TableOfContents } from '@/components/table-of-contents'

const BASE_URL = 'https://www.bestthingreview.com'

function extractFAQs(content: string): Array<{ question: string; answer: string }> {
  const faqStart = content.search(/^## Frequently Asked Questions/m)
  if (faqStart === -1) return []
  const faqSection = content.slice(faqStart)
  const faqs: Array<{ question: string; answer: string }> = []
  const pattern = /^### (.+?)\n+([\s\S]+?)(?=\n+###|\n+##|$)/gm
  let match
  while ((match = pattern.exec(faqSection)) !== null) {
    const question = match[1].trim()
    const answer = match[2]
      .trim()
      .replace(/<[^>]+>/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, ' ')
      .trim()
    if (question && answer) faqs.push({ question, answer })
  }
  return faqs
}

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
  const reviews = getAllReviews()
  return reviews.map(r => ({ category: r.category, slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { category, slug } = await params
  const review = getReview(category as Category, slug)
  if (!review) return {}

  const canonicalUrl = `${BASE_URL}/${review.category}/${review.slug}`

  return {
    title: review.title,
    description: review.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: review.title,
      description: review.excerpt,
      publishedTime: review.publishedAt,
      modifiedTime: review.updatedAt,
      section: review.category,
      authors: review.author ? [review.author.name] : ['BestThingReview'],
      ...(review.coverImage ? { images: [review.coverImage] } : {}),
    },
    twitter: review.coverImage
      ? { card: 'summary_large_image', images: [review.coverImage] }
      : undefined,
  }
}

export default async function ReviewPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: rawCategory, slug } = await params
  const category = rawCategory as Category
  const review = getReview(category, slug)
  if (!review) notFound()

  const { title, excerpt, rating, publishedAt, updatedAt, content, coverImage, author } = review

  const publishDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const updateDate = new Date(updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  const readingTime = Math.ceil(wordCount / 200)

  const headings = extractHeadings(content)

  const related = getAllReviews()
    .filter(r => r.category === category && r.slug !== slug)
    .slice(0, 3)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    dateModified: updatedAt,
    url: `${BASE_URL}/${category}/${slug}`,
    ...(coverImage ? { image: `${BASE_URL}${coverImage}` } : {}),
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'BestThingReview',
      url: BASE_URL,
    },
    ...(author ? {
      author: {
        '@type': 'Person',
        '@id': `${BASE_URL}/#author-${author.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: author.name,
        jobTitle: author.title,
        description: author.bio,
        url: 'https://www.linkedin.com/company/best-web-design-singapore',
        sameAs: ['https://www.linkedin.com/company/best-web-design-singapore'],
        worksFor: { '@id': `${BASE_URL}/#organization` },
      },
    } : {
      author: { '@id': `${BASE_URL}/#organization` },
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${category}/${slug}`,
    },
  }

  const tocSchema = headings.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Table of Contents',
    itemListElement: headings.map((h, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: h.text,
      url: `#${h.id}`,
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: category.charAt(0).toUpperCase() + category.slice(1), item: `${BASE_URL}/${category}` },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  }

  const faqs = extractFAQs(content)
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {tocSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tocSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <span>/</span>
        <Link href={`/${category}`} className="hover:text-brand-blue capitalize">{category}</Link>
        <span>/</span>
        <span className="text-gray-600 truncate">{title}</span>
      </nav>

      {/* Title block */}
      <div className="border-l-4 border-brand-green pl-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={category} />
          <RatingBadge score={rating} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-navy leading-tight">{title}</h1>
        <p className="text-gray-500 text-sm mt-2">
          Published {publishDate} · Updated {updateDate} · {readingTime} min read
        </p>
        {author && (
          <p className="text-gray-500 text-sm mt-1">
            By <span className="font-medium text-gray-700">{author.name}</span>
            {' · '}{author.title}
          </p>
        )}
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
      <p className="text-gray-600 text-base leading-relaxed mb-8 border-b border-gray-100 pb-8">
        {excerpt}
      </p>

      {/* MDX body + TOC sidebar */}
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        <article className="prose prose-gray prose-headings:text-brand-navy prose-a:text-brand-blue max-w-none min-w-0">
          <MDXContent source={content} />
          {related.length > 0 && (
            <div className="not-prose mt-10 p-5 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-bold text-gray-700 mb-3">See Also</p>
              <ul className="space-y-2">
                {related.map(r => (
                  <li key={r.slug}>
                    <Link href={`/${r.category}/${r.slug}`} className="text-brand-blue text-sm hover:underline">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          <TableOfContents headings={headings} />
        </aside>
      </div>

      {/* Author bio */}
      {author && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <a href="https://www.linkedin.com/company/best-web-design-singapore" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-navy text-sm hover:underline">{author.name}</a>
              <p className="text-xs text-brand-blue mb-2">{author.title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{author.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-bold text-brand-navy mb-4">More in {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/${r.category}/${r.slug}`}
                className="group block rounded-lg border border-gray-100 p-4 hover:border-brand-blue transition-colors"
              >
                {r.coverImage && (
                  <Image
                    src={r.coverImage}
                    alt={r.title}
                    width={400}
                    height={210}
                    className="w-full h-auto rounded mb-3"
                  />
                )}
                <p className="text-sm font-semibold text-brand-navy group-hover:text-brand-blue leading-snug line-clamp-2">
                  {r.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">Rating: {r.rating}/10</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

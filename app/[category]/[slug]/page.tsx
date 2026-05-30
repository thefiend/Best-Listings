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
  return {
    title: review.title,
    description: review.excerpt,
    openGraph: review.coverImage ? { images: [review.coverImage] } : undefined,
    twitter: review.coverImage ? { card: 'summary_large_image', images: [review.coverImage] } : undefined,
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

  const headings = extractHeadings(content)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    dateModified: updatedAt,
    ...(coverImage ? { image: coverImage } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'BestThingReview',
      url: 'https://www.bestthingreview.com',
    },
    ...(author ? {
      author: {
        '@type': 'Person',
        name: author.name,
        jobTitle: author.title,
        description: author.bio,
      },
    } : {}),
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
          Published {publishDate} · Updated {updateDate}
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
        </article>

        <aside className="hidden lg:block">
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </div>
  )
}

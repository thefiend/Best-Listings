// app/[category]/[slug]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { getAllReviews, getReview } from '@/lib/content'
import { Category } from '@/lib/types'
import { RatingBadge } from '@/components/rating-badge'
import { CategoryBadge } from '@/components/category-badge'
import { mdxComponents } from '@/lib/mdx-components'

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
  }
}

export default async function ReviewPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: rawCategory, slug } = await params
  const category = rawCategory as Category
  const review = getReview(category, slug)
  if (!review) notFound()

  const { title, excerpt, rating, publishedAt, updatedAt, content } = review

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
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
      </div>

      {/* Excerpt */}
      <p className="text-gray-600 text-base leading-relaxed mb-8 border-b border-gray-100 pb-8">
        {excerpt}
      </p>

      {/* MDX body */}
      <article className="prose prose-gray prose-headings:text-brand-navy prose-a:text-brand-blue max-w-none">
        <MDXContent source={content} />
      </article>
    </div>
  )
}

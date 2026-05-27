import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllComparisons, getComparison } from '@/lib/content'
import { RatingBadge } from '@/components/rating-badge'
import { mdxComponents } from '@/lib/mdx-components'

export const dynamicParams = false

export async function generateStaticParams() {
  const comparisons = getAllComparisons()
  return comparisons.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const comp = getComparison(slug)
  if (!comp) return {}
  return { title: comp.title }
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const comp = getComparison(slug)
  if (!comp) notFound()

  const { title, products, content, publishedAt } = comp

  const publishDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <span>/</span>
        <span className="text-gray-600">Comparison</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2 leading-tight">{title}</h1>
      <p className="text-gray-400 text-sm mb-8">Updated {publishDate}</p>

      {/* Product verdict cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {products.map((product, i) => (
          <div
            key={product.name}
            className={`rounded-lg p-4 border ${
              i === 0
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${i === 0 ? 'text-emerald-700' : 'text-gray-500'}`}>
                #{i + 1}
              </span>
              <RatingBadge score={product.score} />
            </div>
            <p className="font-bold text-gray-900 text-sm">{product.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{product.verdict}</p>
          </div>
        ))}
      </div>

      {/* MDX body */}
      <article className="prose prose-gray prose-headings:text-brand-navy prose-a:text-brand-blue max-w-none">
        <MDXRemote source={content} components={mdxComponents} />
      </article>
    </div>
  )
}

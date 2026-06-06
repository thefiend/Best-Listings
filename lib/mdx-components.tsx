import React from 'react'
import type { MDXComponents } from 'mdx/types'
import { ProsCons } from '@/components/pros-cons'
import { PicksList } from '@/components/picks-list'
import { ScoreBreakdown } from '@/components/score-breakdown'
import { ComparisonTable } from '@/components/comparison-table'
import { CompanyRating } from '@/components/company-rating'
import { slugify } from '@/lib/toc'

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (React.isValidElement(node)) return extractText((node.props as { children?: React.ReactNode }).children)
  return ''
}

const H2 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 id={slugify(extractText(children))} {...props}>{children}</h2>
)

const H3 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 id={slugify(extractText(children))} {...props}>{children}</h3>
)

export const mdxComponents: MDXComponents = {
  ProsCons,
  PicksList,
  ScoreBreakdown,
  ComparisonTable,
  CompanyRating,
  h2: H2,
  h3: H3,
}

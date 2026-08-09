# Deals / Promo Code Category Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/deals` section with affiliate promo code articles, starting with a Tiger Brokers referral code page.

**Architecture:** New top-level `/deals/[slug]` route with its own `Deal` type, `lib/deals.ts` content loader, and `content/deals/` MDX folder — fully separate from the existing review system. Promo codes are defined in YAML frontmatter and rendered by a `<PromoCodeTable>` component with copy-to-clipboard and expiry logic.

**Tech Stack:** Next.js App Router (static generation), MDX via `@mdx-js/mdx`, gray-matter for frontmatter parsing, TypeScript, Tailwind CSS.

## Global Constraints

- All files use TypeScript strict mode — no `any`, no `// @ts-ignore`
- Follow existing import alias pattern: `@/lib/...`, `@/components/...`
- All new components are React Server Components unless interactivity requires `'use client'`
- Copy-to-clipboard requires `'use client'` — isolate it to smallest possible component
- Affiliate links must use `rel="nofollow noopener noreferrer"` and `target="_blank"`
- `dynamicParams = false` on all new static route pages (matches existing pattern)
- Verify after each task with: `npx tsc --noEmit` (fast type check)
- Final task: `next build` to confirm full static generation works

---

### Task 1: Add Deal types to lib/types.ts

**Files:**
- Modify: `lib/types.ts`

**Interfaces:**
- Produces: `PromoCode`, `DealFrontmatter`, `Deal` — used by Tasks 2, 3, 6, 7

- [ ] **Step 1: Open `lib/types.ts` and append the three new interfaces after the existing `SearchResult` interface**

```typescript
export interface PromoCode {
  code: string
  discount: string
  expires: string        // ISO date string "YYYY-MM-DD"
  affiliateUrl: string
  verified: boolean
}

export interface DealFrontmatter {
  title: string
  slug: string
  merchant: string
  merchantUrl: string
  category: 'deals'
  excerpt: string
  coverImage?: string
  publishedAt: string    // ISO date string "YYYY-MM-DD"
  updatedAt: string      // ISO date string "YYYY-MM-DD"
  featured: boolean
  codes: PromoCode[]
}

export interface Deal extends DealFrontmatter {
  content: string        // MDX body (frontmatter stripped)
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat(deals): add PromoCode, DealFrontmatter, Deal types"
```

---

### Task 2: Create lib/deals.ts content loader

**Files:**
- Create: `lib/deals.ts`

**Interfaces:**
- Consumes: `Deal`, `DealFrontmatter` from `lib/types.ts`
- Produces:
  - `getAllDeals(baseDir?: string): Deal[]` — returns all deals sorted by `publishedAt` desc
  - `getDeal(slug: string, baseDir?: string): Deal | undefined`

- [ ] **Step 1: Create `lib/deals.ts`**

```typescript
// lib/deals.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Deal, DealFrontmatter } from './types'

function getDealsDir(baseDir: string) {
  return path.join(baseDir, 'content', 'deals')
}

export function getAllDeals(baseDir = process.cwd()): Deal[] {
  const dealsDir = getDealsDir(baseDir)
  if (!fs.existsSync(dealsDir)) return []

  const files = fs.readdirSync(dealsDir).filter(f => f.endsWith('.mdx'))

  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(dealsDir, file), 'utf8')
      const { data, content } = matter(raw)
      return { ...(data as DealFrontmatter), content }
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getDeal(slug: string, baseDir = process.cwd()): Deal | undefined {
  return getAllDeals(baseDir).find(d => d.slug === slug)
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/deals.ts
git commit -m "feat(deals): add getAllDeals and getDeal content loader"
```

---

### Task 3: Create <PromoCodeTable> component

**Files:**
- Create: `components/promo-code-table.tsx`
- Create: `components/copy-code-button.tsx` (client component — isolates `'use client'`)

**Interfaces:**
- Consumes: `PromoCode` from `lib/types.ts`
- Produces: `<PromoCodeTable codes={PromoCode[]} />` — used in `lib/mdx-components.tsx` (Task 5) and deal article page (Task 7)

- [ ] **Step 1: Create `components/copy-code-button.tsx`** (client component for clipboard access)

```tsx
'use client'

import { useState } from 'react'

interface CopyCodeButtonProps {
  code: string
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-brand-navy text-white hover:bg-brand-blue transition-colors flex-shrink-0"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
```

- [ ] **Step 2: Create `components/promo-code-table.tsx`**

```tsx
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
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/copy-code-button.tsx components/promo-code-table.tsx
git commit -m "feat(deals): add PromoCodeTable and CopyCodeButton components"
```

---

### Task 4: Create <DealCard> component

**Files:**
- Create: `components/deal-card.tsx`

**Interfaces:**
- Consumes: `Deal` from `lib/types.ts`
- Produces: `<DealCard deal={Deal} />` — used in `/deals` index page (Task 6)

- [ ] **Step 1: Create `components/deal-card.tsx`**

```tsx
// components/deal-card.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Deal } from '@/lib/types'

interface DealCardProps {
  deal: Deal
  preload?: boolean
}

function countActiveCodes(deal: Deal): number {
  const now = new Date()
  return deal.codes.filter(c => new Date(c.expires) >= now).length
}

function getTopDiscount(deal: Deal): string {
  const now = new Date()
  const active = deal.codes.filter(c => new Date(c.expires) >= now)
  return active.length > 0 ? active[0].discount : ''
}

export function DealCard({ deal, preload = false }: DealCardProps) {
  const { title, slug, excerpt, coverImage, merchant, publishedAt } = deal
  const activeCodes = countActiveCodes(deal)
  const topDiscount = getTopDiscount(deal)

  return (
    <Link
      href={`/deals/${slug}`}
      className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      {coverImage ? (
        <Image
          src={coverImage}
          alt={title}
          width={1200}
          height={628}
          className="w-full h-auto"
          preload={preload}
        />
      ) : (
        <div className="aspect-[1200/628] bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center">
          <span className="text-white text-2xl font-bold opacity-30">{merchant}</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-green">Deals</span>
          <span className="text-xs text-gray-500">
            {activeCodes} active code{activeCodes !== 1 ? 's' : ''}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-brand-blue transition-colors">
          {title}
        </h3>

        {topDiscount && (
          <p className="text-brand-green text-xs font-semibold mb-1">{topDiscount}</p>
        )}

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{excerpt}</p>

        <p className="text-gray-400 text-xs mt-3">
          {new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/deal-card.tsx
git commit -m "feat(deals): add DealCard component"
```

---

### Task 5: Register PromoCodeTable in MDX components

**Files:**
- Modify: `lib/mdx-components.tsx`

**Interfaces:**
- Consumes: `PromoCodeTable` from `components/promo-code-table.tsx`
- Produces: `PromoCodeTable` available as `<PromoCodeTable>` in all MDX files

- [ ] **Step 1: Add import and registration to `lib/mdx-components.tsx`**

Add import after existing imports:
```typescript
import { PromoCodeTable } from '@/components/promo-code-table'
```

Add to `mdxComponents` object:
```typescript
PromoCodeTable,
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mdx-components.tsx
git commit -m "feat(deals): register PromoCodeTable in MDX components"
```

---

### Task 6: Create /deals index page

**Files:**
- Create: `app/deals/page.tsx`

**Interfaces:**
- Consumes: `getAllDeals()` from `lib/deals.ts`, `DealCard` from `components/deal-card.tsx`
- Produces: `/deals` route listing all deal articles

- [ ] **Step 1: Create `app/deals/page.tsx`**

```tsx
// app/deals/page.tsx
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/deals/page.tsx
git commit -m "feat(deals): add /deals index page"
```

---

### Task 7: Create /deals/[slug] article page

**Files:**
- Create: `app/deals/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllDeals()`, `getDeal(slug)` from `lib/deals.ts`; `PromoCodeTable` from `components/promo-code-table.tsx`; `mdxComponents` from `lib/mdx-components.tsx`; `extractHeadings` from `lib/toc.ts`; `TableOfContents` from `components/table-of-contents.tsx`
- Produces: `/deals/[slug]` route rendering deal article with code table, MDX body, TOC, and affiliate disclosure

- [ ] **Step 1: Create `app/deals/[slug]/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/deals/[slug]/page.tsx
git commit -m "feat(deals): add /deals/[slug] article page"
```

---

### Task 8: Create first content article — Tiger Brokers

**Files:**
- Create: `content/deals/tiger-brokers-promo-codes-singapore.mdx`

**Interfaces:**
- Consumes: `DealFrontmatter` schema defined in Task 1
- Produces: first deal article rendered at `/deals/tiger-brokers-promo-codes-singapore`

- [ ] **Step 1: Create `content/deals/tiger-brokers-promo-codes-singapore.mdx`**

```mdx
---
title: "Tiger Brokers Promo Code Singapore (2026) — Earn Up to USD 150"
slug: tiger-brokers-promo-codes-singapore
merchant: Tiger Brokers
merchantUrl: https://www.tigerbrokers.com.sg
category: deals
excerpt: "Use Tiger Brokers referral code YO0JS1 to earn up to USD 150 in rewards. Verified for Singapore investors opening a new Tiger Brokers account in 2026."
publishedAt: "2026-08-09"
updatedAt: "2026-08-09"
featured: false
codes:
  - code: YO0JS1
    discount: "Earn up to USD 150"
    expires: "2026-12-31"
    affiliateUrl: "https://tigr.link/s/30IH9xl"
    verified: true
---

Tiger Brokers is a Nasdaq-listed digital brokerage operating in Singapore under a Capital Markets Services licence from the Monetary Authority of Singapore. New account holders who use a referral code during sign-up are eligible for welcome rewards including free stock and commission-free trading periods.

## How to Use the Tiger Brokers Referral Code

1. Click **Get Deal** on the code table above, or go directly to [tigerbrokers.com.sg](https://www.tigerbrokers.com.sg)
2. Tap **Sign Up** and complete your identity verification (SingPass MyInfo accepted)
3. Enter referral code **YO0JS1** during the sign-up flow when prompted for a referral or promo code
4. Fund your account to meet the minimum deposit threshold for reward activation
5. Rewards are credited to your Tiger account within the promotional processing period

## What You Get with Code YO0JS1

The referral bonus of **up to USD 150** is tiered based on your initial deposit amount. The exact reward breakdown is displayed in the Tiger Brokers app during sign-up. Rewards may include fractional shares, commission credits, or cash vouchers depending on the active promotion period.

## About Tiger Brokers Singapore

Tiger Brokers (Singapore) Pte Ltd is regulated by the MAS and is a member of the Singapore Exchange. The platform supports trading of Singapore stocks, US stocks, Hong Kong stocks, ETFs, options, and futures from a single account. There are no minimum account balance requirements after initial funding, and the app offers fractional US share trading starting from USD 1.

## Frequently Asked Questions

### Is Tiger Brokers safe for Singapore investors?

Tiger Brokers Singapore is regulated by the Monetary Authority of Singapore (Capital Markets Services Licence) and is a member of the Singapore Exchange. Client assets are held separately from company assets under MAS regulations.

### How long does it take to receive the referral reward?

Rewards are typically credited within 5–10 business days of meeting the qualifying conditions (account verification + minimum deposit). Check the Tiger Brokers app under **Rewards** for real-time status.

### Can existing Tiger Brokers users use code YO0JS1?

Referral codes are for new account sign-ups only. Existing Tiger Brokers account holders are not eligible for new account welcome bonuses.

### What is the minimum deposit to unlock the reward?

The minimum deposit threshold varies by the active promotion. The current reward tiers are displayed during the sign-up flow in the Tiger Brokers app. Check the app for the latest qualifying amounts.
```

- [ ] **Step 2: Run build to verify MDX renders correctly**

```bash
next build
```

Expected: build completes with no errors, `/deals/tiger-brokers-promo-codes-singapore` included in static pages output.

- [ ] **Step 3: Commit**

```bash
git add content/deals/tiger-brokers-promo-codes-singapore.mdx
git commit -m "feat(deals): add Tiger Brokers referral code article (YO0JS1)"
```

---

### Task 9: Add deals to sitemap and llms.txt

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/llms.txt/route.ts`

**Interfaces:**
- Consumes: `getAllDeals()` from `lib/deals.ts`

- [ ] **Step 1: Update `app/sitemap.ts`**

Add import at top with existing imports:
```typescript
import { getAllDeals } from '@/lib/deals'
```

Add deals computation after the `comparisons` line (after `const comparisons = getAllComparisons()`):
```typescript
const deals = getAllDeals()
```

Update the `allDates` array to include deals:
```typescript
const allDates = [
  ...reviews.map(r => new Date(r.updatedAt)),
  ...comparisons.map(c => new Date(c.publishedAt)),
  ...deals.map(d => new Date(d.updatedAt)),
]
```

Add deals index and deal routes before the final `return` statement:
```typescript
const dealRoutes: MetadataRoute.Sitemap = deals.map(d => ({
  url: `${BASE_URL}/deals/${d.slug}`,
  lastModified: new Date(d.updatedAt),
}))

const dealIndexRoute: MetadataRoute.Sitemap = deals.length > 0 ? [{
  url: `${BASE_URL}/deals`,
  lastModified: new Date(Math.max(...deals.map(d => new Date(d.updatedAt).getTime()))),
}] : []
```

Update the return to include deals:
```typescript
return [...staticRoutes, ...reviewRoutes, ...comparisonRoutes, ...companyRoutes, ...dealIndexRoute, ...dealRoutes]
```

- [ ] **Step 2: Update `app/llms.txt/route.ts`**

Add import at top with existing imports:
```typescript
import { getAllDeals } from '@/lib/deals'
```

Add deals fetch inside the `GET` function, after `const comparisons = getAllComparisons()`:
```typescript
const deals = getAllDeals()
```

Add deals section before the `if (comparisons.length > 0)` block:
```typescript
if (deals.length > 0) {
  lines.push('## Deals & Promo Codes')
  lines.push('')
  lines.push(`- [Promo Codes & Referral Codes](${BASE_URL}/deals): Verified Singapore promo codes and referral bonuses`)
  for (const d of deals) {
    lines.push(`- [${d.title}](${BASE_URL}/deals/${d.slug}): ${d.excerpt}`)
  }
  lines.push('')
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/llms.txt/route.ts
git commit -m "feat(deals): add deals to sitemap and llms.txt"
```

---

### Task 10: Add Deals to navigation

**Files:**
- Modify: `components/nav.tsx`
- Modify: `components/mobile-nav.tsx`

**Interfaces:**
- Produces: "Deals" link visible in desktop nav and mobile drawer

Note: `nav.tsx` hardcodes category links from `Category[]` — deals are **not** a Category, so add a standalone link alongside the existing "Companies" and "Contact" links. Do not add `'deals'` to the `Category` type.

- [ ] **Step 1: Update `components/nav.tsx`**

Add a Deals link after the Companies link:
```tsx
<Link href="/deals" className="text-sm text-white/80 hover:text-white transition-colors">
  Deals
</Link>
```

Place it between the categories loop and the "Companies" link:
```tsx
{CATEGORIES.map(cat => (
  <Link key={cat} href={`/${cat}`} className="text-sm text-white/80 hover:text-white transition-colors">
    {CATEGORY_LABELS[cat]}
  </Link>
))}
<Link href="/deals" className="text-sm text-white/80 hover:text-white transition-colors">
  Deals
</Link>
<Link href="/company-review" className="text-sm text-white/80 hover:text-white transition-colors">
  Companies
</Link>
```

- [ ] **Step 2: Update `components/mobile-nav.tsx`**

Add a deals entry to the `LINKS` array after the travel entry:
```typescript
{ href: '/deals', label: 'Deals & Promo Codes', emoji: '🏷️' },
```

- [ ] **Step 3: Type-check and final build**

```bash
npx tsc --noEmit && next build
```

Expected: TypeScript clean, build succeeds, all static pages generated including `/deals` and `/deals/tiger-brokers-promo-codes-singapore`.

- [ ] **Step 4: Commit**

```bash
git add components/nav.tsx components/mobile-nav.tsx
git commit -m "feat(deals): add Deals link to desktop and mobile nav"
```

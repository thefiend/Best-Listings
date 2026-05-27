# BestThingReview.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a statically-generated Next.js editorial review website with homepage, category pages, individual review pages, and comparison pages — all powered by MDX files in git.

**Architecture:** Next.js 14+ App Router with MDX content read from the filesystem via `gray-matter` and rendered via `next-mdx-remote/rsc`. All dynamic pages use `generateStaticParams` + `dynamicParams = false` for fully static output. Tailwind CSS with brand color tokens. Content library functions accept an optional `baseDir` for testability.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS 3, gray-matter, next-mdx-remote v4+, Jest, @testing-library/react, @testing-library/jest-dom

---

## File Map

**Create:**
- `lib/types.ts` — shared TypeScript interfaces (Review, Comparison, Category, etc.)
- `lib/content.ts` — getAllReviews, getFeaturedReviews, getReviewsByCategory, getReview, getAllComparisons, getComparison
- `lib/mdx-components.tsx` — maps custom MDX component names to React components
- `components/category-badge.tsx` — color-coded category pill
- `components/rating-badge.tsx` — gold score badge
- `components/nav.tsx` — site-wide nav (navy, gold logo, category links, decorative search)
- `components/footer.tsx` — footer with category links and tagline
- `components/review-card.tsx` — card used on homepage and category pages
- `components/review-list.tsx` — client component for sortable review list (category page)
- `components/pros-cons.tsx` — MDX component: side-by-side pros/cons panels
- `components/picks-list.tsx` — MDX component: numbered ranked picks with score badges
- `components/score-breakdown.tsx` — MDX component: sub-score rows
- `components/comparison-table.tsx` — MDX component: spec comparison table with winner column
- `app/layout.tsx` — root layout (Nav + Footer wrapper)
- `app/globals.css` — minimal global styles (Tailwind base + body bg)
- `app/page.tsx` — homepage (hero + category pills + featured review grid)
- `app/[category]/page.tsx` — category listing page
- `app/[category]/[slug]/page.tsx` — individual review page
- `app/compare/[slug]/page.tsx` — comparison page
- `content/reviews/tech/best-laptops-2024.mdx` — sample review
- `content/reviews/home/best-robot-vacuums.mdx` — sample review
- `content/comparisons/laptop-comparison.mdx` — sample comparison
- `__tests__/lib/content.test.ts` — content library unit tests
- `__tests__/components/category-badge.test.tsx`
- `__tests__/components/rating-badge.test.tsx`
- `__tests__/components/review-card.test.tsx`
- `__tests__/components/pros-cons.test.tsx`
- `__tests__/components/picks-list.test.tsx`
- `__tests__/components/score-breakdown.test.tsx`
- `__tests__/components/comparison-table.test.tsx`
- `__tests__/fixtures/content/reviews/tech/fixture-review.mdx`
- `__tests__/fixtures/content/reviews/home/fixture-review-home.mdx`
- `__tests__/fixtures/content/comparisons/fixture-comparison.mdx`

**Modify:**
- `tailwind.config.ts` — add brand color tokens
- `next.config.ts` (or `next.config.js`) — no changes needed beyond default
- `.gitignore` — add `.superpowers/`

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `jest.config.ts`, `jest.setup.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Run create-next-app in the project directory**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

When prompted, accept all defaults. This creates `app/`, `public/`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `package.json`.

Expected output ends with: `Success!`

- [ ] **Step 2: Install content and testing dependencies**

```bash
npm install gray-matter next-mdx-remote
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest
```

- [ ] **Step 3: Create jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const customConfig: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(customConfig)
```

- [ ] **Step 4: Create jest.setup.ts**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to package.json**

Open `package.json` and add to the `scripts` object:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 6: Add brand colors to tailwind.config.ts**

Replace the `theme` section of `tailwind.config.ts` with:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#02274A',
          green: '#3AA83C',
          blue: '#1477D1',
          gold: '#FDB926',
          white: '#FBFCF9',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 7: Add .superpowers/ to .gitignore**

Open `.gitignore` and add at the bottom:
```
.superpowers/
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: `▲ Next.js 14.x.x` and `Local: http://localhost:3000` — visit to confirm default page loads. Then stop with Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind brand colors and Jest"
```

---

## Task 2: TypeScript types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create lib/types.ts**

```typescript
// lib/types.ts

export type Category = 'tech' | 'home' | 'software' | 'lifestyle' | 'travel'

export interface ReviewFrontmatter {
  title: string
  category: Category
  slug: string
  excerpt: string
  rating: number        // 0–10
  featured: boolean
  publishedAt: string   // ISO date string e.g. "2024-05-01"
  updatedAt: string
  coverImage?: string
}

export interface Review extends ReviewFrontmatter {
  content: string       // MDX body (frontmatter stripped)
}

export interface ComparisonProduct {
  name: string
  score: number
  verdict: string
}

export interface ComparisonFrontmatter {
  title: string
  slug: string
  category: Category
  products: ComparisonProduct[]
  publishedAt: string
}

export interface Comparison extends ComparisonFrontmatter {
  content: string
}

export interface ReviewPick {
  rank: number
  name: string
  score: number
  label: string         // "Best Overall", "Best Budget", etc.
}

export interface ScoreDimension {
  label: string
  score: number
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript types for reviews and comparisons"
```

---

## Task 3: Content library

**Files:**
- Create: `lib/content.ts`
- Create: `__tests__/lib/content.test.ts`
- Create: `__tests__/fixtures/content/reviews/tech/fixture-review.mdx`
- Create: `__tests__/fixtures/content/reviews/home/fixture-review-home.mdx`
- Create: `__tests__/fixtures/content/comparisons/fixture-comparison.mdx`

- [ ] **Step 1: Create test fixture MDX files**

Create `__tests__/fixtures/content/reviews/tech/fixture-review.mdx`:

```mdx
---
title: "Fixture Tech Review"
category: tech
slug: fixture-tech-review
excerpt: "A fixture review for testing."
rating: 9.0
featured: true
publishedAt: "2024-05-01"
updatedAt: "2024-05-10"
---

Fixture content here.
```

Create `__tests__/fixtures/content/reviews/home/fixture-review-home.mdx`:

```mdx
---
title: "Fixture Home Review"
category: home
slug: fixture-home-review
excerpt: "A home fixture review."
rating: 7.5
featured: false
publishedAt: "2024-03-01"
updatedAt: "2024-03-05"
---

Home fixture content.
```

Create `__tests__/fixtures/content/comparisons/fixture-comparison.mdx`:

```mdx
---
title: "Fixture Comparison"
slug: fixture-comparison
category: tech
products:
  - name: "Product A"
    score: 9.0
    verdict: "Best Overall"
  - name: "Product B"
    score: 7.5
    verdict: "Runner Up"
publishedAt: "2024-05-01"
---

Comparison body content.
```

- [ ] **Step 2: Write failing tests**

Create `__tests__/lib/content.test.ts`:

```typescript
import path from 'path'
import {
  getAllReviews,
  getFeaturedReviews,
  getReviewsByCategory,
  getReview,
  getAllComparisons,
  getComparison,
} from '@/lib/content'

const FIXTURE_DIR = path.join(__dirname, '../fixtures')

describe('getAllReviews', () => {
  it('returns all reviews across all categories', () => {
    const reviews = getAllReviews(FIXTURE_DIR)
    expect(reviews).toHaveLength(2)
  })

  it('returns reviews sorted by publishedAt descending', () => {
    const reviews = getAllReviews(FIXTURE_DIR)
    expect(reviews[0].publishedAt).toBe('2024-05-01')
    expect(reviews[1].publishedAt).toBe('2024-03-01')
  })

  it('includes parsed frontmatter fields', () => {
    const reviews = getAllReviews(FIXTURE_DIR)
    const tech = reviews.find(r => r.slug === 'fixture-tech-review')
    expect(tech).toBeDefined()
    expect(tech!.title).toBe('Fixture Tech Review')
    expect(tech!.rating).toBe(9.0)
    expect(tech!.featured).toBe(true)
  })
})

describe('getFeaturedReviews', () => {
  it('returns only featured reviews', () => {
    const featured = getFeaturedReviews(FIXTURE_DIR)
    expect(featured).toHaveLength(1)
    expect(featured[0].slug).toBe('fixture-tech-review')
  })
})

describe('getReviewsByCategory', () => {
  it('returns reviews matching the category', () => {
    const reviews = getReviewsByCategory('tech', FIXTURE_DIR)
    expect(reviews).toHaveLength(1)
    expect(reviews[0].category).toBe('tech')
  })

  it('returns empty array for category with no reviews', () => {
    const reviews = getReviewsByCategory('travel', FIXTURE_DIR)
    expect(reviews).toHaveLength(0)
  })
})

describe('getReview', () => {
  it('returns the matching review', () => {
    const review = getReview('tech', 'fixture-tech-review', FIXTURE_DIR)
    expect(review).toBeDefined()
    expect(review!.title).toBe('Fixture Tech Review')
  })

  it('returns undefined for unknown slug', () => {
    const review = getReview('tech', 'does-not-exist', FIXTURE_DIR)
    expect(review).toBeUndefined()
  })
})

describe('getAllComparisons', () => {
  it('returns all comparisons', () => {
    const comparisons = getAllComparisons(FIXTURE_DIR)
    expect(comparisons).toHaveLength(1)
    expect(comparisons[0].slug).toBe('fixture-comparison')
  })

  it('includes products array', () => {
    const comparisons = getAllComparisons(FIXTURE_DIR)
    expect(comparisons[0].products).toHaveLength(2)
    expect(comparisons[0].products[0].name).toBe('Product A')
  })
})

describe('getComparison', () => {
  it('returns the matching comparison', () => {
    const comp = getComparison('fixture-comparison', FIXTURE_DIR)
    expect(comp).toBeDefined()
    expect(comp!.title).toBe('Fixture Comparison')
  })

  it('returns undefined for unknown slug', () => {
    const comp = getComparison('no-such-slug', FIXTURE_DIR)
    expect(comp).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern="content.test"
```

Expected: FAIL — `Cannot find module '@/lib/content'`

- [ ] **Step 4: Implement lib/content.ts**

```typescript
// lib/content.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Review, ReviewFrontmatter, Comparison, ComparisonFrontmatter, Category } from './types'

function getReviewsDir(baseDir: string) {
  return path.join(baseDir, 'content', 'reviews')
}

function getComparisonsDir(baseDir: string) {
  return path.join(baseDir, 'content', 'comparisons')
}

export function getAllReviews(baseDir = process.cwd()): Review[] {
  const reviewsDir = getReviewsDir(baseDir)
  if (!fs.existsSync(reviewsDir)) return []

  const categories = fs.readdirSync(reviewsDir).filter(f =>
    fs.statSync(path.join(reviewsDir, f)).isDirectory()
  )

  const reviews: Review[] = []

  for (const category of categories) {
    const categoryDir = path.join(reviewsDir, category)
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
      const raw = fs.readFileSync(path.join(categoryDir, file), 'utf8')
      const { data, content } = matter(raw)
      reviews.push({ ...(data as ReviewFrontmatter), content })
    }
  }

  return reviews.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getFeaturedReviews(baseDir = process.cwd()): Review[] {
  return getAllReviews(baseDir).filter(r => r.featured)
}

export function getReviewsByCategory(category: Category, baseDir = process.cwd()): Review[] {
  return getAllReviews(baseDir).filter(r => r.category === category)
}

export function getReview(category: Category, slug: string, baseDir = process.cwd()): Review | undefined {
  return getAllReviews(baseDir).find(r => r.category === category && r.slug === slug)
}

export function getAllComparisons(baseDir = process.cwd()): Comparison[] {
  const comparisonsDir = getComparisonsDir(baseDir)
  if (!fs.existsSync(comparisonsDir)) return []

  const files = fs.readdirSync(comparisonsDir).filter(f => f.endsWith('.mdx'))

  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(comparisonsDir, file), 'utf8')
      const { data, content } = matter(raw)
      return { ...(data as ComparisonFrontmatter), content }
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getComparison(slug: string, baseDir = process.cwd()): Comparison | undefined {
  return getAllComparisons(baseDir).find(c => c.slug === slug)
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test -- --testPathPattern="content.test"
```

Expected: PASS — all 10 tests green

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts __tests__/
git commit -m "feat: add content library with getAllReviews, getReview, getAllComparisons"
```

---

## Task 4: Sample content

**Files:**
- Create: `content/reviews/tech/best-laptops-2024.mdx`
- Create: `content/reviews/home/best-robot-vacuums.mdx`
- Create: `content/comparisons/laptop-comparison.mdx`

- [ ] **Step 1: Create content/reviews/tech/best-laptops-2024.mdx**

```mdx
---
title: "Best Laptops 2024: Our Top 8 Picks"
category: tech
slug: best-laptops-2024
excerpt: "After testing 24 laptops over six weeks, we found the best options for every budget and use case."
rating: 9.2
featured: true
publishedAt: "2024-05-01"
updatedAt: "2024-05-15"
---

After testing 24 laptops over six weeks, the MacBook Air M3 stood out as the best choice for most people.

<ScoreBreakdown
  topPick="MacBook Air M3"
  dimensions={[
    { label: "Performance", score: 9.5 },
    { label: "Battery Life", score: 9.0 },
    { label: "Value", score: 8.5 }
  ]}
/>

<ProsCons
  pros={["Best-in-class performance", "18hr battery life", "Silent fanless design"]}
  cons={["Pricey vs Windows rivals", "Limited to 24GB RAM", "No HDMI port"]}
/>

## Our Top Picks

<PicksList picks={[
  { rank: 1, name: "MacBook Air M3", score: 9.2, label: "Best Overall" },
  { rank: 2, name: "Dell XPS 15", score: 8.8, label: "Best Windows Laptop" },
  { rank: 3, name: "Lenovo ThinkPad X1 Carbon", score: 8.5, label: "Best for Business" }
]} />

## How We Tested

We used each laptop as a primary machine for at least three days, running a standardized battery test and a suite of performance benchmarks.

## Full Comparison

<ComparisonTable
  headers={["Model", "Score", "Price", "Battery", "OS"]}
  rows={[
    ["MacBook Air M3", "9.2", "$1,099", "18hr", "macOS"],
    ["Dell XPS 15", "8.8", "$1,299", "11hr", "Windows"],
    ["ThinkPad X1 Carbon", "8.5", "$1,449", "15hr", "Windows"]
  ]}
  winnerColumn={0}
/>
```

- [ ] **Step 2: Create content/reviews/home/best-robot-vacuums.mdx**

```mdx
---
title: "Best Robot Vacuums of 2024"
category: home
slug: best-robot-vacuums
excerpt: "We tested 18 robot vacuums to find the best models for every home and budget."
rating: 8.8
featured: true
publishedAt: "2024-04-10"
updatedAt: "2024-04-20"
---

Robot vacuums have gotten remarkably good. After testing 18 models we found clear winners.

<ScoreBreakdown
  topPick="Roborock S8 Pro Ultra"
  dimensions={[
    { label: "Suction Power", score: 9.0 },
    { label: "Mapping", score: 9.2 },
    { label: "Value", score: 8.0 }
  ]}
/>

<ProsCons
  pros={["Exceptional mapping accuracy", "Auto-empty and mop self-clean", "Quiet operation"]}
  cons={["Expensive", "Large dock footprint", "App can be complex"]}
/>

## Our Top Picks

<PicksList picks={[
  { rank: 1, name: "Roborock S8 Pro Ultra", score: 8.8, label: "Best Overall" },
  { rank: 2, name: "iRobot Roomba j7+", score: 8.3, label: "Best for Pet Hair" },
  { rank: 3, name: "Eufy RoboVac 11S", score: 7.8, label: "Best Budget" }
]} />

## Full Comparison

<ComparisonTable
  headers={["Model", "Score", "Price", "Auto-Empty"]}
  rows={[
    ["Roborock S8 Pro Ultra", "8.8", "$1,399", "Yes"],
    ["iRobot Roomba j7+", "8.3", "$599", "Yes"],
    ["Eufy RoboVac 11S", "7.8", "$149", "No"]
  ]}
  winnerColumn={0}
/>
```

- [ ] **Step 3: Create content/comparisons/laptop-comparison.mdx**

```mdx
---
title: "MacBook Air M3 vs Dell XPS 15 vs ThinkPad X1 Carbon"
slug: laptop-comparison
category: tech
products:
  - name: "MacBook Air M3"
    score: 9.2
    verdict: "Best Overall"
  - name: "Dell XPS 15"
    score: 8.8
    verdict: "Best Windows"
  - name: "ThinkPad X1 Carbon"
    score: 8.5
    verdict: "Best for Business"
publishedAt: "2024-05-01"
---

A detailed head-to-head comparison of the top three laptops of 2024.

<ComparisonTable
  headers={["Feature", "MacBook Air M3", "Dell XPS 15", "ThinkPad X1"]}
  rows={[
    ["Price", "$1,099", "$1,299", "$1,449"],
    ["OS", "macOS", "Windows 11", "Windows 11"],
    ["Battery", "18hr", "11hr", "15hr"],
    ["RAM (base)", "8GB", "16GB", "16GB"],
    ["Weight", "2.7 lbs", "4.2 lbs", "2.48 lbs"],
    ["Score", "9.2", "8.8", "8.5"]
  ]}
  winnerColumn={1}
/>

## Verdict

For most users, the MacBook Air M3 wins on battery life and performance-per-dollar.
```

- [ ] **Step 4: Commit**

```bash
git add content/
git commit -m "feat: add sample review and comparison content"
```

---

## Task 5: CategoryBadge and RatingBadge components

**Files:**
- Create: `components/category-badge.tsx`
- Create: `components/rating-badge.tsx`
- Create: `__tests__/components/category-badge.test.tsx`
- Create: `__tests__/components/rating-badge.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/components/category-badge.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { CategoryBadge } from '@/components/category-badge'

test('renders Tech label for tech category', () => {
  render(<CategoryBadge category="tech" />)
  expect(screen.getByText('Tech')).toBeInTheDocument()
})

test('renders Home label for home category', () => {
  render(<CategoryBadge category="home" />)
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('renders Software label for software category', () => {
  render(<CategoryBadge category="software" />)
  expect(screen.getByText('Software')).toBeInTheDocument()
})

test('renders Lifestyle label for lifestyle category', () => {
  render(<CategoryBadge category="lifestyle" />)
  expect(screen.getByText('Lifestyle')).toBeInTheDocument()
})

test('renders Travel label for travel category', () => {
  render(<CategoryBadge category="travel" />)
  expect(screen.getByText('Travel')).toBeInTheDocument()
})
```

Create `__tests__/components/rating-badge.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { RatingBadge } from '@/components/rating-badge'

test('displays score with one decimal place', () => {
  render(<RatingBadge score={9.2} />)
  expect(screen.getByText('9.2')).toBeInTheDocument()
})

test('displays whole number scores with one decimal', () => {
  render(<RatingBadge score={9} />)
  expect(screen.getByText('9.0')).toBeInTheDocument()
})

test('displays star symbol', () => {
  render(<RatingBadge score={8.5} />)
  expect(screen.getByText(/★/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern="category-badge|rating-badge"
```

Expected: FAIL — `Cannot find module '@/components/category-badge'`

- [ ] **Step 3: Implement components/category-badge.tsx**

```typescript
// components/category-badge.tsx
import { Category } from '@/lib/types'

const CATEGORY_STYLES: Record<Category, { bg: string; border: string; text: string; label: string }> = {
  tech:      { bg: 'bg-emerald-50',  border: 'border-emerald-400', text: 'text-emerald-800', label: 'Tech' },
  home:      { bg: 'bg-blue-50',     border: 'border-blue-400',    text: 'text-blue-800',    label: 'Home' },
  software:  { bg: 'bg-yellow-50',   border: 'border-yellow-400',  text: 'text-yellow-800',  label: 'Software' },
  lifestyle: { bg: 'bg-gray-50',     border: 'border-gray-300',    text: 'text-gray-700',    label: 'Lifestyle' },
  travel:    { bg: 'bg-purple-50',   border: 'border-purple-300',  text: 'text-purple-800',  label: 'Travel' },
}

interface CategoryBadgeProps {
  category: Category
  className?: string
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const { bg, border, text, label } = CATEGORY_STYLES[category]
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${bg} ${border} ${text} ${className}`}
    >
      {label}
    </span>
  )
}
```

- [ ] **Step 4: Implement components/rating-badge.tsx**

```typescript
// components/rating-badge.tsx
interface RatingBadgeProps {
  score: number
  className?: string
}

export function RatingBadge({ score, className = '' }: RatingBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 bg-brand-gold text-brand-navy text-xs font-bold px-2 py-0.5 rounded ${className}`}
    >
      {score.toFixed(1)} ★
    </span>
  )
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test -- --testPathPattern="category-badge|rating-badge"
```

Expected: PASS — all 8 tests green

- [ ] **Step 6: Commit**

```bash
git add components/category-badge.tsx components/rating-badge.tsx __tests__/components/category-badge.test.tsx __tests__/components/rating-badge.test.tsx
git commit -m "feat: add CategoryBadge and RatingBadge components"
```

---

## Task 6: Nav and Footer

**Files:**
- Create: `components/nav.tsx`
- Create: `components/footer.tsx`

- [ ] **Step 1: Create components/nav.tsx**

```typescript
// components/nav.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/lib/types'

const CATEGORIES: Category[] = ['tech', 'home', 'software', 'lifestyle', 'travel']
const CATEGORY_LABELS: Record<Category, string> = {
  tech: 'Tech',
  home: 'Home',
  software: 'Software',
  lifestyle: 'Lifestyle',
  travel: 'Travel',
}

export function Nav() {
  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="BestThingReview"
            width={180}
            height={36}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/${cat}`}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
        </div>

        <input
          type="search"
          placeholder="Search..."
          aria-label="Search reviews (coming soon)"
          disabled
          className="hidden lg:block w-44 px-3 py-1.5 text-sm rounded bg-white/10 text-white placeholder-white/50 border border-white/20 cursor-not-allowed"
        />
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Copy logo.svg to public/**

```bash
cp assets/logo.svg public/logo.svg
```

- [ ] **Step 3: Create components/footer.tsx**

```typescript
// components/footer.tsx
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'tech', label: 'Tech' },
  { slug: 'home', label: 'Home' },
  { slug: 'software', label: 'Software' },
  { slug: 'lifestyle', label: 'Lifestyle' },
  { slug: 'travel', label: 'Travel' },
]

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white/70 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-brand-gold font-bold text-lg">BestThingReview</p>
            <p className="text-sm mt-1 max-w-xs">
              Honest, research-driven reviews to help you make confident buying decisions.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Categories</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {CATEGORIES.map(({ slug, label }) => (
                <li key={slug}>
                  <Link href={`/${slug}`} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-xs mt-8 text-white/40">
          © {new Date().getFullYear()} BestThingReview.com · All rights reserved
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/nav.tsx components/footer.tsx public/logo.svg
git commit -m "feat: add Nav and Footer components"
```

---

## Task 7: Root layout and global CSS

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace app/globals.css**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #FBFCF9;
  color: #111827;
}
```

- [ ] **Step 2: Replace app/layout.tsx**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'BestThingReview — Trusted Reviews & Buying Guides',
    template: '%s | BestThingReview',
  },
  description:
    'Expert reviews, in-depth comparisons, and buying guides across tech, home, software, lifestyle, and travel.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify dev server still works**

```bash
npm run dev
```

Visit http://localhost:3000 — nav and footer should appear. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add root layout with Nav, Footer, and global styles"
```

---

## Task 8: ReviewCard component

**Files:**
- Create: `components/review-card.tsx`
- Create: `__tests__/components/review-card.test.tsx`

- [ ] **Step 1: Write failing test**

Create `__tests__/components/review-card.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { ReviewCard } from '@/components/review-card'
import { Review } from '@/lib/types'

const mockReview: Review = {
  title: 'Best Laptops 2024',
  category: 'tech',
  slug: 'best-laptops-2024',
  excerpt: 'After testing 24 laptops...',
  rating: 9.2,
  featured: true,
  publishedAt: '2024-05-01',
  updatedAt: '2024-05-15',
  content: '',
}

test('renders review title', () => {
  render(<ReviewCard review={mockReview} />)
  expect(screen.getByText('Best Laptops 2024')).toBeInTheDocument()
})

test('renders excerpt', () => {
  render(<ReviewCard review={mockReview} />)
  expect(screen.getByText('After testing 24 laptops...')).toBeInTheDocument()
})

test('renders rating badge', () => {
  render(<ReviewCard review={mockReview} />)
  expect(screen.getByText(/9\.2/)).toBeInTheDocument()
})

test('renders category badge', () => {
  render(<ReviewCard review={mockReview} />)
  expect(screen.getByText('Tech')).toBeInTheDocument()
})

test('links to the review page', () => {
  render(<ReviewCard review={mockReview} />)
  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('href', '/tech/best-laptops-2024')
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern="review-card.test"
```

Expected: FAIL — `Cannot find module '@/components/review-card'`

- [ ] **Step 3: Implement components/review-card.tsx**

```typescript
// components/review-card.tsx
import Link from 'next/link'
import { Review } from '@/lib/types'
import { CategoryBadge } from './category-badge'
import { RatingBadge } from './rating-badge'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { title, category, slug, excerpt, rating, publishedAt } = review
  const href = `/${category}/${slug}`

  return (
    <Link href={href} className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white">
      {/* Placeholder image area */}
      <div className="h-36 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
        Cover image
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <CategoryBadge category={category} />
          <RatingBadge score={rating} />
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-brand-blue transition-colors">
          {title}
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        <p className="text-gray-400 text-xs mt-3">
          {new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern="review-card.test"
```

Expected: PASS — all 5 tests green

- [ ] **Step 5: Commit**

```bash
git add components/review-card.tsx __tests__/components/review-card.test.tsx
git commit -m "feat: add ReviewCard component"
```

---

## Task 9: MDX custom components

**Files:**
- Create: `components/pros-cons.tsx`
- Create: `components/picks-list.tsx`
- Create: `components/score-breakdown.tsx`
- Create: `components/comparison-table.tsx`
- Create: `__tests__/components/pros-cons.test.tsx`
- Create: `__tests__/components/picks-list.test.tsx`
- Create: `__tests__/components/score-breakdown.test.tsx`
- Create: `__tests__/components/comparison-table.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/components/pros-cons.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { ProsCons } from '@/components/pros-cons'

test('renders all pros', () => {
  render(<ProsCons pros={['Fast', 'Cheap']} cons={['Heavy']} />)
  expect(screen.getByText('Fast')).toBeInTheDocument()
  expect(screen.getByText('Cheap')).toBeInTheDocument()
})

test('renders all cons', () => {
  render(<ProsCons pros={['Fast']} cons={['Heavy', 'Loud']} />)
  expect(screen.getByText('Heavy')).toBeInTheDocument()
  expect(screen.getByText('Loud')).toBeInTheDocument()
})

test('renders Pros and Cons headings', () => {
  render(<ProsCons pros={['a']} cons={['b']} />)
  expect(screen.getByText('Pros')).toBeInTheDocument()
  expect(screen.getByText('Cons')).toBeInTheDocument()
})
```

Create `__tests__/components/picks-list.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { PicksList } from '@/components/picks-list'
import { ReviewPick } from '@/lib/types'

const picks: ReviewPick[] = [
  { rank: 1, name: 'MacBook Air M3', score: 9.2, label: 'Best Overall' },
  { rank: 2, name: 'Dell XPS 15', score: 8.8, label: 'Best Windows' },
]

test('renders all pick names', () => {
  render(<PicksList picks={picks} />)
  expect(screen.getByText('MacBook Air M3')).toBeInTheDocument()
  expect(screen.getByText('Dell XPS 15')).toBeInTheDocument()
})

test('renders labels', () => {
  render(<PicksList picks={picks} />)
  expect(screen.getByText('Best Overall')).toBeInTheDocument()
  expect(screen.getByText('Best Windows')).toBeInTheDocument()
})

test('renders scores', () => {
  render(<PicksList picks={picks} />)
  expect(screen.getByText(/9\.2/)).toBeInTheDocument()
  expect(screen.getByText(/8\.8/)).toBeInTheDocument()
})
```

Create `__tests__/components/score-breakdown.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { ScoreBreakdown } from '@/components/score-breakdown'

const dimensions = [
  { label: 'Performance', score: 9.5 },
  { label: 'Battery', score: 9.0 },
]

test('renders top pick name', () => {
  render(<ScoreBreakdown topPick="MacBook Air M3" dimensions={dimensions} />)
  expect(screen.getByText('MacBook Air M3')).toBeInTheDocument()
})

test('renders all dimension labels', () => {
  render(<ScoreBreakdown topPick="Test" dimensions={dimensions} />)
  expect(screen.getByText('Performance')).toBeInTheDocument()
  expect(screen.getByText('Battery')).toBeInTheDocument()
})

test('renders dimension scores', () => {
  render(<ScoreBreakdown topPick="Test" dimensions={dimensions} />)
  expect(screen.getByText('9.5')).toBeInTheDocument()
  expect(screen.getByText('9.0')).toBeInTheDocument()
})
```

Create `__tests__/components/comparison-table.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { ComparisonTable } from '@/components/comparison-table'

const headers = ['Model', 'Price', 'Score']
const rows = [
  ['MacBook Air M3', '$1,099', '9.2'],
  ['Dell XPS 15', '$1,299', '8.8'],
]

test('renders all headers', () => {
  render(<ComparisonTable headers={headers} rows={rows} />)
  expect(screen.getByText('Model')).toBeInTheDocument()
  expect(screen.getByText('Price')).toBeInTheDocument()
  expect(screen.getByText('Score')).toBeInTheDocument()
})

test('renders all row data', () => {
  render(<ComparisonTable headers={headers} rows={rows} />)
  expect(screen.getByText('MacBook Air M3')).toBeInTheDocument()
  expect(screen.getByText('$1,299')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern="pros-cons|picks-list|score-breakdown|comparison-table"
```

Expected: FAIL — module not found errors

- [ ] **Step 3: Implement components/pros-cons.tsx**

```typescript
// components/pros-cons.tsx
interface ProsConsProps {
  pros: string[]
  cons: string[]
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h4 className="font-bold text-emerald-800 mb-3">Pros</h4>
        <ul className="space-y-1.5">
          {pros.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-emerald-600 mt-0.5 flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-bold text-red-800 mb-3">Cons</h4>
        <ul className="space-y-1.5">
          {cons.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement components/picks-list.tsx**

```typescript
// components/picks-list.tsx
import { ReviewPick } from '@/lib/types'
import { RatingBadge } from './rating-badge'

interface PicksListProps {
  picks: ReviewPick[]
}

const RANK_STYLES = [
  'bg-brand-green text-white',
  'bg-brand-blue text-white',
  'bg-gray-400 text-white',
]

export function PicksList({ picks }: PicksListProps) {
  return (
    <div className="space-y-3 my-6 not-prose">
      {picks.map(pick => {
        const rankStyle = RANK_STYLES[pick.rank - 1] ?? 'bg-gray-300 text-gray-700'
        return (
          <div
            key={pick.rank}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${rankStyle}`}
            >
              {pick.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{pick.name}</p>
              <p className="text-gray-500 text-xs">{pick.label}</p>
            </div>
            <RatingBadge score={pick.score} />
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 5: Implement components/score-breakdown.tsx**

```typescript
// components/score-breakdown.tsx
import { ScoreDimension } from '@/lib/types'
import { RatingBadge } from './rating-badge'

interface ScoreBreakdownProps {
  topPick: string
  dimensions: ScoreDimension[]
}

export function ScoreBreakdown({ topPick, dimensions }: ScoreBreakdownProps) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-6 not-prose">
      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">⭐ Top Pick</p>
      <p className="font-bold text-gray-900 text-base mb-4">{topPick}</p>
      <div className="space-y-2">
        {dimensions.map(({ label, score }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-brand-green h-1.5 rounded-full"
                  style={{ width: `${(score / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-6 text-right">{score.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Implement components/comparison-table.tsx**

```typescript
// components/comparison-table.tsx
interface ComparisonTableProps {
  headers: string[]
  rows: string[][]
  winnerColumn?: number  // 0-indexed column index to highlight
}

export function ComparisonTable({ headers, rows, winnerColumn }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto my-6 not-prose">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-brand-navy text-white">
            {headers.map((header, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left font-semibold ${
                  i === winnerColumn ? 'text-brand-gold' : ''
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 border-b border-gray-100 ${
                    ci === winnerColumn ? 'font-bold text-brand-green' : 'text-gray-700'
                  } ${ci === 0 ? 'font-medium text-gray-900' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 7: Run tests to confirm they pass**

```bash
npm test -- --testPathPattern="pros-cons|picks-list|score-breakdown|comparison-table"
```

Expected: PASS — all tests green

- [ ] **Step 8: Commit**

```bash
git add components/pros-cons.tsx components/picks-list.tsx components/score-breakdown.tsx components/comparison-table.tsx __tests__/components/
git commit -m "feat: add MDX custom components (ProsCons, PicksList, ScoreBreakdown, ComparisonTable)"
```

---

## Task 10: MDX component registry

**Files:**
- Create: `lib/mdx-components.tsx`

- [ ] **Step 1: Create lib/mdx-components.tsx**

```typescript
// lib/mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import { ProsCons } from '@/components/pros-cons'
import { PicksList } from '@/components/picks-list'
import { ScoreBreakdown } from '@/components/score-breakdown'
import { ComparisonTable } from '@/components/comparison-table'

export const mdxComponents: MDXComponents = {
  ProsCons,
  PicksList,
  ScoreBreakdown,
  ComparisonTable,
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/mdx-components.tsx
git commit -m "feat: add MDX component registry"
```

---

## Task 11: Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```typescript
// app/page.tsx
import { getFeaturedReviews } from '@/lib/content'
import { ReviewCard } from '@/components/review-card'
import { Category } from '@/lib/types'
import Link from 'next/link'

const CATEGORIES: { slug: Category; label: string; emoji: string }[] = [
  { slug: 'tech',      label: 'Tech & Gadgets', emoji: '⚡' },
  { slug: 'home',      label: 'Home & Living',  emoji: '🏠' },
  { slug: 'software',  label: 'Business Software', emoji: '💼' },
  { slug: 'lifestyle', label: 'Lifestyle',      emoji: '✨' },
  { slug: 'travel',    label: 'Travel',         emoji: '✈️' },
]

export default function HomePage() {
  const featured = getFeaturedReviews()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-blue text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Find the Best Products for You
          </h1>
          <p className="text-white/75 text-lg mb-8">
            Expert reviews trusted by thousands of readers
          </p>
          <input
            type="search"
            placeholder="Search reviews, categories, products..."
            disabled
            aria-label="Search (coming soon)"
            className="w-full max-w-lg px-5 py-3 rounded-lg text-gray-900 text-sm placeholder-gray-400 cursor-not-allowed"
          />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(({ slug, label, emoji }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors hover:bg-brand-navy hover:text-white hover:border-brand-navy border-gray-300 text-gray-700"
            >
              <span>{emoji}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Featured reviews */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand-navy">Featured Reviews</h2>
        </div>

        {featured.length === 0 ? (
          <p className="text-gray-500 text-sm">No featured reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(review => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify homepage renders**

```bash
npm run dev
```

Visit http://localhost:3000 — should show hero, category pills, and featured review cards. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add homepage with hero, category pills, and featured review grid"
```

---

## Task 12: ReviewList client component

**Files:**
- Create: `components/review-list.tsx`

- [ ] **Step 1: Create components/review-list.tsx**

```typescript
// components/review-list.tsx
'use client'

import { useState } from 'react'
import { Review } from '@/lib/types'
import { ReviewCard } from './review-card'

type SortKey = 'newest' | 'top-rated' | 'alpha'

interface ReviewListProps {
  reviews: Review[]
}

function sortReviews(reviews: Review[], by: SortKey): Review[] {
  const copy = [...reviews]
  if (by === 'newest') {
    return copy.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
  if (by === 'top-rated') {
    return copy.sort((a, b) => b.rating - a.rating)
  }
  return copy.sort((a, b) => a.title.localeCompare(b.title))
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [sort, setSort] = useState<SortKey>('newest')
  const sorted = sortReviews(reviews, sort)

  const options: { key: SortKey; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'top-rated', label: 'Top Rated' },
    { key: 'alpha', label: 'A–Z' },
  ]

  return (
    <>
      {/* Sort bar */}
      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 mb-6 w-fit">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sort === key
                ? 'bg-brand-navy text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews in this category yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map(review => (
            <div key={review.slug} className="flex gap-4 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
              <div className="w-28 flex-shrink-0 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                Image
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                    {review.rating.toFixed(1)} ★
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(review.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{review.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2">{review.excerpt}</p>
                <a
                  href={`/${review.category}/${review.slug}`}
                  className="inline-block mt-2 text-xs font-medium text-brand-blue hover:underline"
                >
                  Read review →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/review-list.tsx
git commit -m "feat: add ReviewList client component with sort (Newest, Top Rated, A-Z)"
```

---

## Task 13: Category page

**Files:**
- Create: `app/[category]/page.tsx`

- [ ] **Step 1: Create app/[category]/page.tsx**

```typescript
// app/[category]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getReviewsByCategory } from '@/lib/content'
import { ReviewList } from '@/components/review-list'
import { Category } from '@/lib/types'

export const dynamicParams = false

const VALID_CATEGORIES: Category[] = ['tech', 'home', 'software', 'lifestyle', 'travel']

const CATEGORY_META: Record<Category, { label: string; description: string }> = {
  tech:      { label: 'Tech & Gadgets',     description: 'Expert reviews of laptops, headphones, phones, and more.' },
  home:      { label: 'Home & Living',      description: 'Reviews of home appliances, furniture, and essentials.' },
  software:  { label: 'Business Software',  description: 'In-depth reviews of SaaS tools, CRMs, and productivity apps.' },
  lifestyle: { label: 'Lifestyle',          description: 'Reviews of wellness products, fashion, and personal care.' },
  travel:    { label: 'Travel',             description: 'Reviews of luggage, booking services, and travel gear.' },
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const meta = CATEGORY_META[params.category as Category]
  if (!meta) return {}
  return {
    title: meta.label,
    description: meta.description,
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category as Category
  if (!VALID_CATEGORIES.includes(category)) notFound()

  const reviews = getReviewsByCategory(category)
  const { label, description } = CATEGORY_META[category]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="border-l-4 border-brand-green pl-4 mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">{label}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} · {description}
        </p>
      </div>

      <ReviewList reviews={reviews} />
    </div>
  )
}
```

- [ ] **Step 2: Verify category page renders**

```bash
npm run dev
```

Visit http://localhost:3000/tech — should show Tech reviews list with sort controls. Visit http://localhost:3000/home — should show Home reviews. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/[category]/page.tsx
git commit -m "feat: add category listing page with sort"
```

---

## Task 14: Review page

**Files:**
- Create: `app/[category]/[slug]/page.tsx`

- [ ] **Step 1: Create app/[category]/[slug]/page.tsx**

```typescript
// app/[category]/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllReviews, getReview } from '@/lib/content'
import { Category } from '@/lib/types'
import { RatingBadge } from '@/components/rating-badge'
import { CategoryBadge } from '@/components/category-badge'
import { mdxComponents } from '@/lib/mdx-components'

export const dynamicParams = false

export async function generateStaticParams() {
  const reviews = getAllReviews()
  return reviews.map(r => ({ category: r.category, slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string }
}): Promise<Metadata> {
  const review = getReview(params.category as Category, params.slug)
  if (!review) return {}
  return {
    title: review.title,
    description: review.excerpt,
  }
}

export default function ReviewPage({ params }: { params: { category: string; slug: string } }) {
  const review = getReview(params.category as Category, params.slug)
  if (!review) notFound()

  const { title, category, excerpt, rating, publishedAt, updatedAt, content } = review

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
        <MDXRemote source={content} components={mdxComponents} />
      </article>
    </div>
  )
}
```

- [ ] **Step 2: Install @tailwindcss/typography for prose styles**

```bash
npm install -D @tailwindcss/typography
```

Add to `tailwind.config.ts` plugins array:
```typescript
plugins: [require('@tailwindcss/typography')],
```

- [ ] **Step 3: Verify review page renders**

```bash
npm run dev
```

Visit http://localhost:3000/tech/best-laptops-2024 — should show full review with MDX components (ScoreBreakdown, ProsCons, PicksList, ComparisonTable) rendered. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/[category]/[slug]/page.tsx tailwind.config.ts package.json package-lock.json
git commit -m "feat: add individual review page with MDX rendering"
```

---

## Task 15: Comparison page

**Files:**
- Create: `app/compare/[slug]/page.tsx`

- [ ] **Step 1: Create app/compare/[slug]/page.tsx**

```typescript
// app/compare/[slug]/page.tsx
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
  params: { slug: string }
}): Promise<Metadata> {
  const comp = getComparison(params.slug)
  if (!comp) return {}
  return { title: comp.title }
}

export default function ComparisonPage({ params }: { params: { slug: string } }) {
  const comp = getComparison(params.slug)
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
```

- [ ] **Step 2: Verify comparison page renders**

```bash
npm run dev
```

Visit http://localhost:3000/compare/laptop-comparison — should show product verdict cards and full comparison table. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/compare/[slug]/page.tsx
git commit -m "feat: add comparison page with product verdict cards and MDX"
```

---

## Task 16: Static build verification

**Files:** None

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: PASS — all tests green, no failures

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build completes without errors. Output shows static routes:
```
○ /
○ /tech
○ /home
○ /software
○ /lifestyle
○ /travel
● /tech/best-laptops-2024
● /home/best-robot-vacuums
● /compare/laptop-comparison
```
(○ = static, ● = static with params)

- [ ] **Step 3: Verify static build serves correctly**

```bash
npm run start
```

Visit http://localhost:3000 — confirm homepage, category pages, review pages, and comparison page all load. Stop with Ctrl+C.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete BestThingReview.com Next.js website"
```

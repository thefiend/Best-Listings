# BestThingReview.com

Statically-generated editorial review and comparison website. Built with Next.js 16 App Router, MDX content, and Tailwind CSS.

## Stack

- **Next.js 16** — App Router, fully static generation (`dynamicParams = false`)
- **MDX** — Content stored as `.mdx` files in `content/`, parsed with `gray-matter`
- **next-mdx-remote/rsc** — Renders MDX in React Server Components
- **Tailwind CSS v4** — Brand colors defined in `app/globals.css` `@theme inline`
- **TypeScript** throughout
- **Jest + @testing-library/react** — 36 tests

## Project Structure

```
content/
  reviews/
    tech/          # .mdx review files
    home/
    software/
    lifestyle/
    travel/
  comparisons/     # .mdx comparison files

app/
  page.tsx                     # Homepage
  [category]/page.tsx          # Category listing (/tech, /home, etc.)
  [category]/[slug]/page.tsx   # Individual review
  compare/[slug]/page.tsx      # Comparison page

components/
  nav.tsx, footer.tsx
  review-card.tsx, review-list.tsx
  category-badge.tsx, rating-badge.tsx
  pros-cons.tsx, picks-list.tsx, score-breakdown.tsx, comparison-table.tsx

lib/
  types.ts        # Shared TypeScript interfaces
  content.ts      # getAllReviews, getReview, getAllComparisons, getComparison
  mdx-components.tsx  # MDX component registry
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Content

### Review

Create `content/reviews/<category>/<slug>.mdx`:

```mdx
---
title: "Best Laptops 2024"
category: tech
slug: best-laptops-2024
excerpt: "After testing 24 laptops..."
rating: 9.2
featured: true
publishedAt: "2024-05-01"
updatedAt: "2024-05-15"
---

Your review body here. Use custom components:

<ScoreBreakdown topPick="MacBook Air M3" dimensions={[
  { label: "Performance", score: 9.5 },
  { label: "Battery", score: 9.0 }
]} />

<ProsCons
  pros={["Great performance", "Long battery"]}
  cons={["Expensive"]}
/>

<PicksList picks={[
  { rank: 1, name: "MacBook Air M3", score: 9.2, label: "Best Overall" }
]} />
```

Valid categories: `tech` | `home` | `software` | `lifestyle` | `travel`

Set `featured: true` to show on the homepage grid.

### Comparison

Create `content/comparisons/<slug>.mdx`:

```mdx
---
title: "MacBook vs Dell vs ThinkPad"
slug: laptop-comparison
category: tech
products:
  - name: "MacBook Air M3"
    score: 9.2
    verdict: "Best Overall"
  - name: "Dell XPS 15"
    score: 8.8
    verdict: "Best Windows"
publishedAt: "2024-05-01"
---

<ComparisonTable
  headers={["Feature", "MacBook", "Dell"]}
  rows={[["Price", "$1,099", "$1,299"]]}
  winnerColumn={1}
/>
```

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build (static)
npm run start      # Serve production build
npm test           # Run test suite
npm run test:watch # Watch mode
npm run lint       # ESLint
```

## Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brand-navy` | `#02274A` | Nav, headings |
| `brand-green` | `#3AA83C` | Tech category, pros, top picks |
| `brand-blue` | `#1477D1` | Home category, links |
| `brand-gold` | `#FDB926` | Ratings, logo accent |
| `brand-white` | `#FBFCF9` | Page background |

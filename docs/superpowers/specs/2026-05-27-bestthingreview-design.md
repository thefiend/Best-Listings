# BestThingReview.com — Website Design Spec

**Date:** 2026-05-27
**Stack:** Next.js App Router + MDX + Tailwind CSS
**Deploy target:** Vercel (or any static host)

---

## Overview

Editorial review and comparison platform. Human-written long-form reviews across 5 categories. Content stored as MDX files in git, statically generated at build time. No monetization at launch.

**Brand colors:**
- Navy: `#02274A` (nav, headings, primary)
- Green: `#3AA83C` (Tech category, pros, top picks)
- Blue: `#1477D1` (Home category, secondary actions)
- Gold: `#FDB926` (ratings, logo accent)
- White: `#FBFCF9` (page backgrounds)

**Design direction:** Hybrid — white page backgrounds, navy nav, color-coded category badges, gold rating badges.

---

## Architecture

### Stack
- **Next.js 14+ App Router** — file-based routing, React Server Components
- **MDX** — content files with frontmatter, read via `fs` in `lib/content.ts`
- **Tailwind CSS** — utility-first styling
- **`gray-matter`** — parse MDX frontmatter
- **`next-mdx-remote`** — render MDX content in RSC context (or `@next/mdx`)
- **TypeScript** throughout

### File Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout — Nav + Footer
│   ├── page.tsx                # Homepage
│   ├── [category]/
│   │   ├── page.tsx            # Category listing — /tech, /home, etc.
│   │   └── [slug]/
│   │       └── page.tsx        # Individual review — /tech/best-laptops-2024
│   └── compare/
│       └── [slug]/
│           └── page.tsx        # Comparison page — /compare/laptop-comparison
├── content/
│   ├── reviews/
│   │   ├── tech/
│   │   ├── home/
│   │   ├── software/
│   │   ├── lifestyle/
│   │   └── travel/
│   └── comparisons/
├── components/
│   ├── nav.tsx
│   ├── footer.tsx
│   ├── review-card.tsx
│   ├── rating-badge.tsx
│   ├── pros-cons.tsx
│   ├── picks-list.tsx
│   └── comparison-table.tsx
├── lib/
│   └── content.ts              # getAllReviews, getReview, getComparison, etc.
└── assets/
    └── logo.svg
```

---

## Content Model

### Review MDX Frontmatter

```yaml
---
title: "Best Laptops 2024: Our Top 8 Picks"
category: tech          # tech | home | software | lifestyle | travel
slug: best-laptops-2024
excerpt: "After testing 24 laptops over 6 weeks..."
rating: 9.2             # overall score, 0–10
featured: true          # show on homepage card grid
publishedAt: 2024-05-01
updatedAt: 2024-05-15
coverImage: /images/reviews/best-laptops-2024.jpg   # optional
---
```

### Comparison MDX Frontmatter

```yaml
---
title: "MacBook Air M3 vs Dell XPS 15 vs ThinkPad X1"
slug: laptop-comparison
category: tech
products:
  - name: "MacBook Air M3"
    score: 9.2
    verdict: "Best Overall"
  - name: "Dell XPS 15"
    score: 8.8
    verdict: "Best Windows"
publishedAt: 2024-05-01
---
```

---

## Pages

### Homepage `/`

**Layout:** Nav → Hero → Category Pills → Featured Reviews grid → Footer

- **Nav:** Logo (SVG from `/assets/logo.svg`), category links (Tech, Home, Software, Lifestyle, Travel), search input
- **Hero:** Dark navy gradient background, headline, subheadline, centered search input
- **Category pills:** Horizontal scrollable row of pills, color-coded per category
- **Featured Reviews:** `featured: true` articles only, 3-column card grid (responsive: 1-col mobile, 2-col tablet, 3-col desktop)
- **Footer:** Logo, category links, tagline

### Category Page `/[category]`

**Layout:** Nav → Category header → Sort bar → Article list → Footer

- Category header: Large title with colored left border, article count
- Sort bar: Newest | Top Rated | A–Z (client component)
- Article list: Horizontal card (thumbnail left, title/excerpt/rating right)
- `generateStaticParams` returns all 5 categories

### Review Page `/[category]/[slug]`

**Layout:** Nav → Breadcrumb → Title block → Score card → Pros/Cons → Body (MDX) → Picks list → Comparison table → Footer

- **Breadcrumb:** Home → Category → Title
- **Title block:** Green left border, title, author/date byline
- **Score card:** Large numeric score, top pick name. Sub-scores (e.g. Performance, Battery, Value) rendered via custom `<ScoreBreakdown>` MDX component in body — not in frontmatter
- **Pros/Cons:** Side-by-side green/red panels rendered via custom `<ProsCons>` MDX component in body
- **Body:** Full MDX content
- **Picks list:** Numbered ranked list, #1 green, #2 blue, rest neutral, each with score badge
- **Comparison table:** All picks in a spec table, winner column highlighted
- `generateStaticParams` returns all review slugs per category

### Comparison Page `/compare/[slug]`

**Layout:** Nav → Title → Comparison table → Footer

- Full-width spec table: navy header row, alternating row backgrounds
- Winner column highlighted gold
- Mobile: horizontally scrollable table
- `generateStaticParams` returns all comparison slugs

---

## Components

| Component | Purpose |
|---|---|
| `<Nav>` | Site-wide nav, dark navy, gold logo, search |
| `<Footer>` | Links, tagline |
| `<ReviewCard>` | Homepage/category card — image, badge, title, excerpt, rating |
| `<RatingBadge score={9.2}>` | Gold bg, navy text, numeric score |
| `<ProsCons pros={[]} cons={[]}>`| Side-by-side green/red lists |
| `<PicksList picks={[]}>` | Numbered ranked picks with scores |
| `<ComparisonTable products={[]}>` | Spec comparison table |
| `<CategoryBadge category="tech">` | Color-coded pill label |

---

## Category Color Mapping

| Category | Badge bg | Border | Text |
|---|---|---|---|
| tech | `#f0fdf4` | `#3AA83C` | `#166534` |
| home | `#eff6ff` | `#1477D1` | `#1e40af` |
| software | `#fefce8` | `#FDB926` | `#854d0e` |
| lifestyle | `#f9fafb` | `#d1d5db` | `#374151` |
| travel | `#fdf4ff` | `#a855f7` | `#6b21a8` |

---

## Data Flow

```
content/reviews/tech/best-laptops-2024.mdx
        ↓
lib/content.ts (fs.readFileSync + gray-matter)
        ↓
app/[category]/[slug]/page.tsx (RSC, generateStaticParams)
        ↓
Static HTML at build time
```

All pages are statically generated (`force-static` or default static in App Router). No server-side rendering at runtime.

---

## Out of Scope (Launch)

- Search (nav search input is decorative at launch; no backend. Can add Pagefind later for static search)
- Comments / user accounts
- Monetization / affiliate links
- Image optimization beyond Next.js `<Image>` defaults
- RSS feed (can add later)
- Sitemap (can add later via `app/sitemap.ts`)

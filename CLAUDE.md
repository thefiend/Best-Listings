# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (fully static)
npm run lint         # ESLint
npm test             # Run all Jest tests
npm run test:watch   # Tests in watch mode
npx jest __tests__/components/review-card.test.tsx  # Single test file
python3 scripts/generate-company-data.py  # Regenerate lib/company-data.json
```

## Architecture

Static Next.js 16 site (App Router, React 19). No database. All content is MDX files read at build time.

**Content pipeline:** MDX files in `content/` → parsed by `lib/content.ts` with `gray-matter` → rendered via `next-mdx-remote` → statically generated pages. `dynamicParams = false` on all routes — every page must exist at build time.

**Categories:** `tech | home | business | lifestyle | travel` — used in URL paths and frontmatter.

**Routes:**
- `app/[category]/[slug]/page.tsx` — individual reviews
- `app/compare/[slug]/page.tsx` — product comparisons
- `app/company-review/[slug]/page.tsx` — company reviews
- `app/api/search/route.ts` — search suggestions (GET, query ≥ 2 chars, max 8 results)

## Content

MDX files in `content/reviews/<category>/` and `content/comparisons/`. Required frontmatter fields: `title`, `category`, `slug`, `excerpt`, `rating` (0-10), `featured` (bool), `publishedAt`, `updatedAt`.

Custom MDX components (registered in `lib/mdx-components.tsx`): `<ScoreBreakdown />`, `<ProsCons />`, `<PicksList />`, `<ComparisonTable />`, `<CompanyRating />`, `<FeatureCta />`. H2/H3 headings get auto-generated IDs for TOC.

## Key Files

- `lib/content.ts` — all content loading functions (`getAllReviews`, `getReview`, `getReviewsByCategory`, `getAllComparisons`, `getComparison`)
- `lib/types.ts` — `ReviewFrontmatter`, `ComparisonFrontmatter`, `Category` types
- `lib/companies.ts` — extracts company metadata from MDX via regex; reads `lib/company-data.json`
- `tailwind.config.ts` — brand colors: `brand-navy` (#02274A), `brand-green` (#3AA83C), `brand-blue` (#1477D1), `brand-gold` (#FDB926), `brand-white` (#FBFCF9)
- `next.config.ts` — security headers, CSP directives, 301 redirects

## Testing

Jest + React Testing Library. Tests in `__tests__/` mirror the source structure (components/, lib/, api/). Run a single file with `npx jest <path>`.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Workflow

Before committing or pushing, always run `git diff --staged` and review all staged changes carefully. Verify every file is correct and intentional before proceeding.

## Scripts — Always Reuse Existing

Never write one-off scripts for tasks already covered by existing scripts. Always use the canonical script:

- **Featured images (OG):** `npx tsx scripts/generate-og-image.ts --article <mdx-path> --output <output-path>`
- **Business photos:** `python3 scripts/fetch-place-photos.py --inject <mdx-files...>`
- **Company data:** `python3 scripts/generate-company-data.py`

## Writing Style

Never use " — " (em dash with spaces) anywhere in content, titles, or code comments. Use a colon, comma, or rewrite the sentence instead.

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

## SEO Standards (apply to every article)

### Frontmatter requirements

- **`title`**: Follow format `"[N] Best [Topic] in Singapore (2026): [Differentiator]"` or `"Best [Topic] Singapore (2026): Top [N] Ranked by Reviews"`. Include year. Max 60 chars.
- **`slug`**: Never include the year. Use `best-topic-singapore`, never `best-topic-singapore-2026`. The year lives in the title only.
- **`excerpt`** (meta description): 150–160 chars. Include: primary keyword + best pick with star rating + use-case signal + year. Example: `"Top 10 aircon cleaning services in Singapore ranked by Google reviews and pricing. Best overall: SJR Aircon (5.0★, 300+ reviews). HDB, condo, commercial, 2026."`
- **`updatedAt`**: Update this date whenever article content is refreshed. Freshness is a ranking signal.
- **`publishedAt`**: Set to actual first publish date. Never fabricate.
- **`rating`**: 0–10 numeric. Reflects overall quality of the category's top pick.

### Required article sections (in order)

1. **Intro paragraph** (150–200 words) — answer "who is this for and why did we write it" in first 100 words. Primary keyword in first sentence.
2. **Key Takeaways** bold list — best overall, best for [use case], and 3–4 must-know facts with specific data (prices, review counts, credentials).
3. **`<ScoreBreakdown />`** — top pick with 5 scored dimensions.
4. **`<ProsCons />`** — 4 pros, 2–3 cons for top pick.
5. **"How We Ranked"** H2 section — explicit methodology: what data sources, what minimum thresholds, what was excluded and why. Minimum 100 words.
6. **`<PicksList />`** — all ranked picks with rank, name, score, label.
7. **Individual company sections** — H3 per company with `<a id="business-[N]"></a>` anchor, photo, description (150–250 words), address, phone, website, `<CompanyRating />`, one verified review quote.
8. **`<ComparisonTable />`** — side-by-side comparison of top 5–6 picks.
9. **`## Frequently Asked Questions`** H2 — minimum 5 Q&A pairs as H3 sub-headings. These power FAQPage schema automatically. Questions must match real search queries (check GSC).
10. **Closing recommendation paragraph** — 1 paragraph summarising the best choice for each use case.

### Schema (auto-generated — no manual action needed)

`app/[category]/[slug]/page.tsx` automatically generates:
- `Article` schema (from frontmatter)
- `BreadcrumbList` schema
- `FAQPage` schema (from `## Frequently Asked Questions` section — requires H3 Q&A format)
- `ItemList` "best-of" schema (from `<PicksList>` component — requires `rank`, `name`, `score`, `label` fields)
- `ItemList` TOC schema (from H2/H3 headings)

### Redirects

Every new article slug MUST be added to the `businessSlugs` array in `next.config.ts`. This ensures that if a `-2026`-suffixed URL was ever indexed by Google, it redirects to the canonical slug. Do this at article creation time, not retroactively.

### llms.txt

Add every new article to `public/llms.txt` under the correct category section. Format: `- [Title](URL): One-sentence description of what was evaluated and how.`

### CTR optimisation checklist

Before publishing any article:
- [ ] Title includes year and clear differentiator (not just "Top 10 X")
- [ ] Excerpt 150–160 chars with primary keyword + best pick name + star rating
- [ ] `updatedAt` is current
- [ ] `## Frequently Asked Questions` section exists with ≥5 Q&As
- [ ] `<PicksList>` present with correct rank/name/score/label
- [ ] Individual company anchors use `<a id="business-[N]"></a>` format
- [ ] Slug added to `businessSlugs` in `next.config.ts`
- [ ] Entry added to `public/llms.txt`

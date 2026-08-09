---
name: new-article
description: Use when creating a new "best of" business listing article for bestthingreview.com. Triggers on /new-article command or requests to write/generate a new review article for a business type.
---

# new-article

## Overview

Full pipeline for generating a business listing MDX article. Follows `docs/article-generation-spec.md` exactly. Sitemap and `/llms.txt` auto-regenerate from MDX files on next request — no manual update needed.

## Usage

```
/new-article <BUSINESS_TYPE> <CATEGORY>
```

Examples:
- `/new-article "hair salons" lifestyle`
- `/new-article "pest control" business`
- `/new-article "solar companies" home`

**Valid categories:** `tech` · `home` · `business` · `lifestyle` · `travel`

## Pipeline (run in order)

### 1. Generate CTA image
```bash
npx tsx scripts/generate-og-image.ts --type cta --output public/images/cta/<CATEGORY>-cta.png
```
Skip if `public/images/cta/<CATEGORY>-cta.png` already exists.

### 2. Extract Google Maps data
```bash
npx tsx scripts/extract-maps.ts --query "best <BUSINESS_TYPE> singapore" --count 50
```
This produces `places_data` JSON. Do not invent or modify any business name, address, phone, website, rating, or reviewCount from this output.

### 3. Check featured companies
Read `assets/featured-companies.txt`. Case-insensitive partial match against business names in `places_data`. If matched:
- Move matched businesses to top ranks (rank 1, 2, …) in the order they appear in the file
- First match = "Best Overall" label; subsequent = descriptive specialism labels
- Use followed links (no `rel`) for featured companies
- Override `reviewCount` to `1299` for featured companies in contact block and ComparisonTable

### 4. Generate MDX article
Follow `docs/article-generation-spec.md` exactly. Required sections in order:

1. Opening paragraph (keyword + location in first 100 words)
2. Key Takeaways (4–6 standalone citable facts)
3. `<ScoreBreakdown>` (top pick only)
4. `<ProsCons>` (top pick only)
5. `## How We Ranked These <Business Type>`
6. `## Our Top Picks` + `<PicksList>`
7. Per-business H3 sections — each ends with: description → contact block → customer quote → CTA block
8. `## How They Compare` + `<ComparisonTable>`
9. `## What to Look for When Hiring a <Business Type>`
10. `## Frequently Asked Questions` (8–12 Q&A, H3 per question)
11. `## Verdict`
12. JSON-LD schema block (`ItemList` + `FAQPage` + `BreadcrumbList` + `Article`)

**Key rules:**
- `<a id="business-{N}"></a>` on line immediately before every H3 business section
- All website links use raw `<a>` HTML tags (not Markdown) to support `rel` attributes
- CTA block after every customer quote: `<a href="/contact" ...><img src="/images/cta/<CATEGORY>-cta.png" .../></a>`
- Never use em dash with spaces ` — ` — replace with `, `
- Score = Google rating × 2, rounded to 1 decimal
- `rating` frontmatter = top-ranked business score
- Word count target: 2,500–4,000 words

### 5. Generate OG cover image
```bash
npx tsx scripts/generate-og-image.ts --article content/reviews/<CATEGORY>/best-<BUSINESS_TYPE>-singapore-2026.mdx
```

### 6. Save article
```
content/reviews/<CATEGORY>/best-<BUSINESS_TYPE>-singapore-2026.mdx
```
Set `coverImage` frontmatter to `/images/og/best-<BUSINESS_TYPE>-singapore-2026.png`.

### 7. Verify
```bash
npm run build
```
Build must pass. Sitemap and `/llms.txt` auto-update on next request — no manual step.

## Frontmatter template

```yaml
---
title: "10 Best <Business Type> in Singapore (2026) — [Power Word]"
category: <CATEGORY>
slug: best-<business-type>-singapore
excerpt: "<145–160 chars: how many evaluated, criteria, what reader gets>"
rating: <top business Google rating × 2>
featured: false
publishedAt: "<YYYY-MM-DD>"
updatedAt: "<YYYY-MM-DD>"
coverImage: "/images/og/best-<business-type>-singapore-2026.png"
author:
  name: "Jason Kam"
  title: "Lead Service Reviewer"
  bio: "Jason Kam is the Lead Service Reviewer at Best Thing Review. He brings a technical, systematic rigour to an industry that has long relied on word-of-mouth and guesswork. Rather than evaluating services from behind a desk, Jason personally engages with every provider he reviews, booking them directly, observing their work first-hand, and holding each one to a consistent, measurable standard."
---
```

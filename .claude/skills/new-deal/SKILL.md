---
name: new-deal
description: Use when creating a new promo code or referral code deal article for the /deals section of bestthingreview.com. Triggers on /new-deal command or requests to add a merchant promo/referral code page.
---

# new-deal

## Overview

Creates a deal/promo-code MDX article under `content/deals/`. Follows `docs/superpowers/specs/2026-08-09-deals-category-design.md`. Unlike review articles, deals require manual updates to `app/sitemap.ts` and `app/llms.txt/route.ts` — those do not auto-update.

## Usage

```
/new-deal "<MERCHANT>" "<CODE>" "<AFFILIATE_URL>" "<DISCOUNT_DESCRIPTION>"
```

Example:
```
/new-deal "Tiger Brokers" "YO0JS1" "https://tigr.link/s/30IH9xl" "Earn up to USD 150"
```

## Prerequisites — scaffold deals infrastructure first

Check if these files exist. If any are missing, create them before writing the article:

| File | Purpose |
|---|---|
| `app/deals/page.tsx` | `/deals` index page |
| `app/deals/[slug]/page.tsx` | Deal article page |
| `lib/deals.ts` | `getAllDeals()`, `getDeal(slug)` |
| `components/promo-code-table.tsx` | Code rows with copy + expiry logic |
| `components/deal-card.tsx` | Card for index page |
| `components/deal-hero.tsx` | Hero section for article |

Scaffold reference: `docs/superpowers/specs/2026-08-09-deals-category-design.md` — data models, component specs, page content structure.

## Pipeline (run in order)

### 1. Scaffold infrastructure (if missing)
Create any missing files above before proceeding.

### 2. Generate OG image
```bash
npx tsx scripts/generate-og-image.ts --type cta --output public/images/og/<merchant-slug>-promo-codes.png
```

### 3. Write MDX article
Save to: `content/deals/<merchant-slug>-promo-codes-singapore.mdx`

**Article structure (in this order):**
1. `<DealHero>` — auto-rendered from frontmatter, do not add manually
2. `<PromoCodeTable>` — auto-rendered from frontmatter `codes[]`, do not add manually
3. Editorial intro (2–3 paragraphs: what the code is, who it's for, what the reward is)
4. Step-by-step redemption guide (numbered list, specific steps)
5. FAQ section (6–10 Q&A, H3 per question)
6. Affiliate disclosure — auto-appended by layout, do not add to MDX body

**No** `<ScoreBreakdown>`, `<ProsCons>`, or `<PicksList>` — deals are not scored.

### 4. Frontmatter template

```yaml
---
title: "<Merchant> Promo Code Singapore (<Month Year>) — <CODE>"
slug: <merchant-slug>-promo-codes-singapore
merchant: <Merchant Name>
merchantUrl: https://www.<merchant-domain>
category: deals
excerpt: "<145–160 chars: latest code, reward, who it's for>"
coverImage: "/images/og/<merchant-slug>-promo-codes.png"
publishedAt: "<YYYY-MM-DD>"
updatedAt: "<YYYY-MM-DD>"
featured: false
codes:
  - code: <CODE>
    discount: "<reward description>"
    expires: "<YYYY-MM-DD>"
    affiliateUrl: "<AFFILIATE_URL>"
    verified: true
---
```

### 5. Update sitemap.ts
Unlike reviews, deals do NOT auto-appear in the sitemap. Add `getAllDeals()` import and deal routes to `app/sitemap.ts`:

```ts
import { getAllDeals } from '@/lib/deals'
// ...
const deals = getAllDeals()
const dealRoutes: MetadataRoute.Sitemap = deals.map(d => ({
  url: `${BASE_URL}/deals/${d.slug}`,
  lastModified: new Date(d.updatedAt),
}))
// add dealRoutes to return array
```

Also add `/deals` index to `staticRoutes`.

### 6. Update llms.txt
Add deals section to `app/llms.txt/route.ts` — import `getAllDeals` and append deal links to the `lines` array alongside reviews.

### 7. Verify
```bash
npm run build
```
Build must pass. Check `/deals` and `/deals/<slug>` render correctly.

## SEO rules

- Title format: `"<Merchant> Promo Code Singapore (<Month Year>) — <CODE>"`
- Excerpt: 145–160 chars, contains merchant name + code + reward
- Primary keyword in first 100 words of editorial intro
- `updatedAt` = today (signals freshness; bump this field monthly)
- Affiliate disclosure required for E-E-A-T compliance (auto-appended by layout)

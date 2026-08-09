# Deals / Promo Code Category — Design Spec

**Date:** 2026-08-09
**Status:** Approved

---

## Goal

Add a `/deals` section to bestthingreview.com for affiliate-commission promo code and referral code articles. First article: Tiger Brokers referral code `YO0JS1`.

---

## Commission Model

Affiliate/referral links only. No direct brand deals. Each code has its own `affiliateUrl`. Revenue from user click-throughs on referral links.

---

## URL Structure

```
/deals                                         ← index
/deals/tiger-brokers-promo-codes-singapore     ← article
/deals/shopee-promo-codes-singapore
...
```

Top-level `/deals/` route — separate from existing `[category]/[slug]` review system. No subcategory nesting.

---

## Data Model

### New types in `lib/types.ts`

```ts
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
  publishedAt: string
  updatedAt: string
  featured: boolean
  codes: PromoCode[]
}

export interface Deal extends DealFrontmatter {
  content: string        // MDX body (frontmatter stripped)
}
```

### Frontmatter example

```yaml
---
title: "Tiger Brokers Promo Code Singapore (August 2026)"
slug: tiger-brokers-promo-codes-singapore
merchant: Tiger Brokers
merchantUrl: https://www.tigerbrokers.com.sg
category: deals
excerpt: "Latest Tiger Brokers referral code for Singapore investors. Use YO0JS1 to earn up to USD 150."
coverImage: "/images/og/tiger-brokers-promo-codes.png"
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
```

---

## File Structure

```
content/deals/
  tiger-brokers-promo-codes-singapore.mdx
  (future merchant articles)

app/deals/
  page.tsx              ← /deals index page
  [slug]/
    page.tsx            ← /deals/[slug] article page

lib/
  deals.ts              ← getAllDeals(), getDeal(slug)

components/
  promo-code-table.tsx  ← renders codes[] with copy button + expiry logic
  deal-card.tsx         ← card for /deals index
  deal-hero.tsx         ← hero section for deal article page
```

`content/deals/` sits at same level as `content/reviews/` and `content/comparisons/`.

---

## Components

### `<PromoCodeTable>`

Renders `codes[]` from frontmatter. Each row:
- Code pill (monospace font, copy-to-clipboard button)
- Discount description
- Expiry date with colour logic:
  - Green = valid
  - Amber = expires within 7 days
  - Red strikethrough = expired
- "Verified" badge showing last-checked date
- "Get Deal →" CTA button linking to `affiliateUrl`

First code treated as featured (highlighted row, larger CTA).

### `<DealCard>`

Used on `/deals` index. Shows:
- Merchant name + logo (optional)
- Active code count (excludes expired)
- Top discount teaser
- Link to `/deals/[slug]`

### `<DealHero>`

Top of each deal article:
- Merchant name + link to `merchantUrl`
- `updatedAt` date
- Active code count (auto-computed, excludes expired)

No `<RatingBadge>`, `<ScoreBreakdown>`, or `<ProsCons>` — deals are not evaluated/scored.

---

## Page Content Structure

Each MDX article body:
1. `<DealHero>` (auto-rendered from frontmatter)
2. `<PromoCodeTable>` (auto-rendered from frontmatter `codes[]`)
3. Editorial intro (how the code works, who it's for)
4. Step-by-step redemption guide
5. FAQ section
6. Affiliate disclosure (auto-appended in layout)

---

## SEO Integration

### Metadata per deal page

- Title: `"{merchant} Promo Code Singapore ({Month Year}) — {first code}"`
- Description: `excerpt` from frontmatter
- Canonical: `https://www.bestthingreview.com/deals/[slug]`
- `updatedAt` → `lastModified` in sitemap (signals freshness to Google)

### `/deals` index page

- Title: `"Singapore Promo Codes & Referral Codes (2026)"`
- Description: `"Verified promo codes, referral bonuses, and discount codes for Singapore services and investment platforms."`

### Sitemap

`app/sitemap.ts` — add `getAllDeals()` alongside existing `getAllReviews()`. Deal URLs auto-included with `lastModified` from `updatedAt`.

### llms.txt

`app/llms.txt/route.ts` — add deals to AI visibility listing.

---

## Affiliate Disclosure

Auto-rendered in deal article layout (not in MDX body):

> *"This page contains affiliate and referral links. We may earn a commission at no extra cost to you."*

Required for FTC compliance and Google E-E-A-T trust signals.

---

## Out of Scope

- Direct brand deals / negotiated codes
- Geo-subcategories (e.g. `/deals/singapore/`)
- Automatic code verification / scraping
- User-submitted codes

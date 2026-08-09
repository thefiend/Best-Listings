# Analytics Tracking Design

## Goal

Add custom event tracking on top of the existing GA4 pageview setup to capture affiliate conversion signals (promo code copies, "Get Deal" clicks) and content engagement signals (search result selections). Scroll depth and generic outbound clicks are handled by GA4 Enhanced Measurement with no code changes.

## Architecture

GA4 is already wired in `app/layout.tsx` via `NEXT_PUBLIC_GA_ID`. No consent banner — PDPA does not mandate explicit cookie consent for anonymous analytics, and GA4 anonymises IPs by default.

A thin `lib/analytics.ts` wrapper centralises all event calls. No third-party analytics package is introduced.

GA4 Enhanced Measurement (enable once in GA4 console, no code):
- Scroll depth (25 / 50 / 75 / 90 %)
- Outbound clicks (generic)

## Event Taxonomy

| Event name | Parameters | Fired when |
|---|---|---|
| `affiliate_click` | `merchant` (string), `code` (string), `deal_slug` (string), `affiliate_url` (string) | User clicks "Get Deal" on a promo code row |
| `promo_code_copy` | `merchant` (string), `code` (string), `deal_slug` (string) | User successfully copies a promo code to clipboard |
| `search_result_click` | `query` (string), `result_slug` (string), `result_type` (string), `position` (number) | User clicks or Enter-selects a search result |

## Global Constraints

- No third-party analytics packages — use `window.gtag` only
- All `trackEvent` calls must guard against SSR (`typeof window === 'undefined'`) and absent GA4 script (`typeof window.gtag !== 'function'`)
- `PromoCodeTable` must remain a server component — client interactivity isolated to `AffiliateCta` and `CopyCodeButton` leaf components
- Affiliate links keep `rel="nofollow noopener noreferrer"` and `target="_blank"`
- Event parameter keys use `snake_case` to match GA4 convention

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `lib/analytics.ts` | Create | Typed `trackEvent()` wrapper around `window.gtag` |
| `components/affiliate-cta.tsx` | Create | `'use client'` "Get Deal" anchor with `affiliate_click` event |
| `components/copy-code-button.tsx` | Modify | Add `merchant` + `dealSlug` props; fire `promo_code_copy` on clipboard success |
| `components/promo-code-table.tsx` | Modify | Accept `merchant` + `dealSlug` props; thread to children; swap raw `<a>` for `AffiliateCta` |
| `app/deals/[slug]/page.tsx` | Modify | Pass `merchant={deal.merchant}` and `dealSlug={deal.slug}` to `PromoCodeTable` |
| `components/search-dropdown.tsx` | Modify | Fire `search_result_click` on result click and Enter-key selection |
| `__tests__/lib/analytics.test.ts` | Create | Unit tests for `trackEvent` |

## Component Interfaces

### `lib/analytics.ts`

```typescript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

type EventParams = Record<string, string | number | boolean>

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
```

### `components/affiliate-cta.tsx`

```typescript
'use client'

interface AffiliateCtaProps {
  merchant: string
  code: string
  dealSlug: string
  affiliateUrl: string
  isPrimary: boolean
}
```

Renders the same `<a>` as the current inline anchor in `PromoCodeTable`. Adds an `onClick` handler that calls `trackEvent('affiliate_click', { merchant, code, deal_slug: dealSlug, affiliate_url: affiliateUrl })`.

### `components/copy-code-button.tsx` (updated)

```typescript
interface CopyCodeButtonProps {
  code: string
  merchant: string
  dealSlug: string
}
```

Fires `trackEvent('promo_code_copy', { merchant, code, deal_slug: dealSlug })` after the `navigator.clipboard.writeText` promise resolves successfully.

### `components/promo-code-table.tsx` (updated)

```typescript
interface PromoCodeTableProps {
  codes: PromoCode[]
  merchant: string
  dealSlug: string
}
```

### `search-dropdown.tsx` change

`handleResultClick` receives `(result: SearchResult, index: number)` and fires:

```typescript
trackEvent('search_result_click', {
  query,
  result_slug: result.slug,
  result_type: result.type,
  position: index,
})
```

Enter-key path fires the same event for `results[0]` at `position: 0`.

## Testing

`__tests__/lib/analytics.test.ts`:
- Mock `window.gtag`, call `trackEvent('test_event', { foo: 'bar' })`, assert `window.gtag` called with `('event', 'test_event', { foo: 'bar' })`
- Assert `trackEvent` does not throw when `window.gtag` is undefined
- Assert `trackEvent` does not throw in SSR context (delete `window`)

No new tests needed for the component changes — the event calls are one-liners inside existing tested interaction paths.

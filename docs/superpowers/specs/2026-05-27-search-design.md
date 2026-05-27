# Search Feature Design

**Date:** 2026-05-27
**Status:** Approved

## Overview

Enable the currently-disabled search inputs in the nav and hero with real search functionality. Inline dropdown shows results as the user types — no dedicated search page.

## Architecture

Three pieces:

1. **`/app/api/search/route.ts`** — GET handler, takes `q` param, searches in-memory
2. **`components/search-dropdown.tsx`** — `'use client'` component with input + dropdown
3. **Nav + hero wired up** — replace disabled `<input>` elements with `<SearchDropdown />`

## API

`GET /api/search?q={query}`

- Calls `getAllReviews()` + `getAllComparisons()` on each request
- Filters where title, excerpt, or category contains `q` (case-insensitive substring)
- Returns max 8 results
- Empty or <2 char query returns `[]`

Response shape:

```ts
{
  type: 'review' | 'comparison'
  title: string
  slug: string
  category: Category
  excerpt?: string   // reviews only
  rating?: number    // reviews only
}[]
```

Result URLs:
- Review → `/{category}/{slug}`
- Comparison → `/comparisons/{slug}`

## Component Behavior

- Minimum 2 chars before fetching
- 300ms debounce on input
- Loading: no spinner (results appear when ready)
- No results: "No results for 'xyz'" message
- Keyboard: `Escape` closes, `Enter` navigates to first result
- Click-outside closes dropdown

Result item displays:
- Title
- Category badge
- Excerpt snippet truncated to ~60 chars

## Placement

- **Nav** (`components/nav.tsx`): replace disabled `<input>` with `<SearchDropdown />`. Dropdown anchors below input, `w-72` min-width. Hidden on mobile (unchanged).
- **Hero** (`app/page.tsx`): replace disabled `<input>` with `<SearchDropdown />`. Dropdown matches input width (`max-w-lg`).

## Scope

- No new dependencies
- No dedicated `/search` page
- No full-body content search (title + excerpt + category only)
- No fuzzy matching — plain case-insensitive substring match

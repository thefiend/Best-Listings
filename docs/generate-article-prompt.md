# Article Generation Prompt

Copy the prompt below into Claude Code. Replace `BUSINESS_TYPE` and `CATEGORY` before running.

**Valid categories:** `tech` · `home` · `business` · `lifestyle` · `travel`

---

## Variables

| Variable | Replace with | Example |
|---|---|---|
| `BUSINESS_TYPE` | What to search for | `aircon servicing` |
| `CATEGORY` | Article category | `home` |

---

## Prompt

```
Using @docs/article-generation-spec.md:

1. Run scripts/extract-maps.ts for "best BUSINESS_TYPE singapore" --count 10
2. Check assets/featured-companies.txt for any matches in the results
3. Generate the full MDX article following the spec exactly
4. Run scripts/generate-og-image.ts to create the cover image
5. Save article to content/reviews/CATEGORY/best-BUSINESS_TYPE-singapore-2026.mdx with coverImage frontmatter set

Keyword:  best BUSINESS_TYPE in singapore 2026
Category: CATEGORY
Location: Singapore
Count:    10
Date:     2026-05-27
```

---

## Examples

| BUSINESS_TYPE | CATEGORY |
|---|---|
| `aircon servicing` | `home` |
| `roofing contractor` | `home` |
| `limousine service` | `lifestyle` |
| `seo agency` | `business` |
| `travel agency` | `travel` |
| `web design agency` | `business` |
| `interior designer` | `home` |
| `wedding photographer` | `lifestyle` |

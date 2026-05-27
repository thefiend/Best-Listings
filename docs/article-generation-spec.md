# BestThingReview — Business Listing Article Generation Spec

Claude follows this document to generate a complete "best-of businesses" article as an MDX file ready to drop into `content/reviews/{category}/`.

This spec is for **business/service listings** — florists, web designers, plumbers, restaurants, lawyers, contractors, etc. Data comes from `scripts/extract-maps.ts` (Google Maps).

---

## Input

| Input | Required | Notes |
|---|---|---|
| `keyword` | Yes | e.g. `"best florists london 2024"` |
| `category` | Yes | One of: `tech` · `home` · `software` · `lifestyle` · `travel` |
| `location` | Yes | City or region covered — appears throughout article |
| `count` | No | How many businesses to list. Default 10 |
| `places_data` | Yes | JSON from `scripts/extract-maps.ts`. Do not invent business details. |

---

## Output

A single `.mdx` file saved to:

```
content/reviews/{category}/{slug}.mdx
```

---

## Frontmatter Schema

```yaml
---
title: "10 Best Florists in London (2024) — Tested & Reviewed"
category: lifestyle
slug: best-florists-london-2024
excerpt: "We researched 30+ florists across London to find the best for weddings, corporate events, and everyday arrangements — ranked by reviews, quality, and service."
rating: 9.6
featured: false
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
---
```

**Field rules:**
- `title` — 50–65 chars. Format: `"{N} Best {business type} in {location} ({year})"`. Power word optional.
- `category` — must be one of the 5 valid values.
- `slug` — lowercase, hyphens. Match the keyword URL exactly.
- `excerpt` — 145–160 chars. Explain how many you researched, what criteria you used, what readers get.
- `rating` — top business's Google rating × 2 (e.g. 4.8 stars → 9.6). If no rating in places_data, use 9.0 as default.
- `featured` — `true` only for homepage feature. Use sparingly.
- `publishedAt` / `updatedAt` — today's date in `YYYY-MM-DD`.

---

## Article Structure

Sections must appear in this exact order.

### 1. Opening paragraph

3–4 sentences. State why finding a good `{business type}` in `{location}` matters, how many you evaluated, and what criteria determined the rankings. Contains the target keyword. No preamble — lead with value.

```mdx
Finding a reliable florist in London means navigating hundreds of shops with wildly varying quality, pricing, and reliability. We researched 34 florists across all major London boroughs, evaluating Google reviews, website transparency, pricing, and same-day delivery capability. This list covers the best options for weddings, corporate events, and daily arrangements — ranked by overall quality and customer satisfaction.
```

### 2. ScoreBreakdown (top-ranked business only)

Immediately after the opening paragraph. Dimensions must reflect what matters when hiring this type of business. Use 4–5 service-quality dimensions — not product specs.

```mdx
<ScoreBreakdown
  topPick="Bloom & Stem"
  dimensions={[
    { label: "Service Quality", score: 9.8 },
    { label: "Value for Money", score: 9.2 },
    { label: "Response Time", score: 9.5 },
    { label: "Professionalism", score: 9.6 },
    { label: "Customer Satisfaction", score: 9.7 }
  ]}
/>
```

Scores must average within ±0.3 of the `rating` in frontmatter.

**Good dimensions by business type:**

| Business type | Good dimensions |
|---|---|
| Florists, caterers, event planners | Service Quality, Value, Response Time, Creativity, Reliability |
| Contractors, plumbers, electricians | Workmanship, Pricing Transparency, Punctuality, Communication, Guarantees |
| Lawyers, accountants, consultants | Expertise, Responsiveness, Value, Communication, Track Record |
| Restaurants, cafés | Food Quality, Service, Ambiance, Value, Consistency |
| Web agencies, designers | Quality of Work, Communication, Delivery Speed, Value, Support |

### 3. ProsCons (top-ranked business only)

```mdx
<ProsCons
  pros={[
    "Same-day delivery available across all London postcodes",
    "Dedicated wedding coordinator included free with bookings over £300",
    "Sustainably sourced flowers — certified by the Florist Association",
    "Fastest response time we tested — replied within 20 minutes"
  ]}
  cons={[
    "Premium pricing — 20–30% above mid-market average",
    "Walk-in only by appointment — no drop-in browsing",
    "Minimum order £45 for delivery"
  ]}
/>
```

3–5 pros, 2–3 cons. Specific and factual. No vague praise ("great service") or vague criticism ("a bit expensive").

### 4. How We Ranked These Businesses (H2)

```mdx
## How We Ranked These {Business Type}

[2–3 sentences. State your ranking criteria explicitly: Google review score, review count, website clarity, pricing transparency, service range, response time tested, any in-person or direct contact. Be specific — name the metrics.]
```

Example:
```mdx
## How We Ranked These Florists

We ranked each florist using: Google Maps rating (minimum 4.0 required), review count (minimum 20), website quality and pricing transparency, delivery coverage, and response time to a test enquiry sent via their contact form. Businesses with fake review patterns or no verifiable address were excluded.
```

### 5. Our Top Picks (H2)

```mdx
## Our Top Picks
```

Immediately followed by PicksList. Labels describe what each business is best for — never "Runner-Up" or "Second Best".

```mdx
<PicksList picks={[
  { rank: 1, name: "Bloom & Stem",        score: 9.6, label: "Best Overall" },
  { rank: 2, name: "Petal & Co.",         score: 9.0, label: "Best for Weddings" },
  { rank: 3, name: "Urban Blooms",        score: 8.6, label: "Best Budget Option" },
  { rank: 4, name: "The Flower Factory",  score: 8.4, label: "Best for Corporate Events" },
  { rank: 5, name: "Stems & Stories",     score: 8.2, label: "Best for Same-Day Delivery" }
]} />
```

`score` for each business: Google rating × 2, rounded to 1 decimal. Use real values from `places_data`.

### 6. Per-business sections (H3, repeated)

One section per business, in the same order as PicksList. Each section has four parts: description, contact block, and customer quote.

**Featured company rule (read `assets/featured-companies.txt` before writing the article):**

Before generating the article, check whether any business in `places_data` matches a name in `assets/featured-companies.txt` (case-insensitive, partial match acceptable). If a match exists:
- Move that business to **rank 1** regardless of its Google rating
- Assign it the "Best Overall" label in PicksList
- Renumber all other businesses starting from rank 2
- Use a **followed** website link (no `rel` attribute) for that business only
- All other businesses use `rel="nofollow noopener noreferrer"` on their website links

```mdx
### 1. Bloom & Stem — Best Overall

Bloom & Stem has operated from their Shoreditch studio since 2011, specialising in bespoke event floristry and corporate installations. Their team of six designers handles everything from single bouquets to full wedding venue dressing across Greater London. Same-day delivery is available for orders placed before noon. The business sources flowers directly from Dutch auction houses three times weekly, which explains both the freshness and the premium pricing. They responded to our test enquiry within 18 minutes — fastest of all businesses we contacted.

📍 **Address:** 47 Redchurch Street, London E2 7DJ\
📞 **Phone:** +44 20 7946 0847\
🌐 **Website:** <a href="https://bloomsandstem.co.uk">bloomsandstem.co.uk</a>\
⭐ **Rating:** 4.8 (347 Google reviews)

> "Commissioned a full table arrangement for our company's annual dinner. The team arrived on time, set up without any fuss, and the flowers were still fresh three days later. Would not use anyone else for our events." — *James T. ★★★★★*

### 2. Petal & Co. — Best for Weddings

[description]

📍 **Address:** 12 Kensington Church Street, London W8 4EP\
📞 **Phone:** +44 20 7946 1293\
🌐 **Website:** <a href="https://petalandco.london" rel="nofollow noopener noreferrer">petalandco.london</a>\
⭐ **Rating:** 4.7 (212 Google reviews)
```

**Description rules:**
- 100–150 words
- Use real data from `places_data` verbatim: name, address, phone, website, rating, reviewCount
- Include: what they specialise in, years in operation (if known or estimable from reviews), service area, one specific differentiator (pricing, speed, specialty, award, certification)
- No invented review counts or ratings — use exact figures from `places_data`
- End with one sentence making a clear case for why this business made the list

**Contact block format:**

Each item must be followed by a trailing `\` to force a line break in MDX. Without it, all items render on the same line.

Use raw HTML `<a>` tags for website links (not Markdown link syntax) so `rel` attributes can be set.

```
📍 **Address:** {address from places_data}\
📞 **Phone:** {phone from places_data or omit line if null}\
🌐 **Website:** <a href="{full url}" rel="nofollow noopener noreferrer">{domain}</a>\
⭐ **Rating:** {rating} ({reviewCount} Google reviews)
```

**Exception — featured company (in `assets/featured-companies.txt`):**
```
🌐 **Website:** <a href="{full url}">{domain}</a>\
```
No `rel` attribute. This passes link equity to the featured company.

Omit phone line entirely if `phone` is null. Omit website line if `website` is null. Last line (Rating) has no trailing `\`.

**Customer quote rules:**
- One blockquote (`>`) per business
- 1–2 sentences. Specific praise — what service, what occasion, what impressed them
- Format: `"Quote text." — *First Name L. ★★★★★*`
- Rating always 4 or 5 stars
- Never generic ("great service, highly recommend") — always specific to an occasion or detail

### 7. Comparison table (H2)

```mdx
## How They Compare

<ComparisonTable
  headers={["Business", "Rating", "Reviews", "Specialism", "Min. Order"]}
  rows={[
    ["Bloom & Stem",       "4.8 ★", "347", "Events & weddings", "£45"],
    ["Petal & Co.",        "4.7 ★", "212", "Weddings",          "£60"],
    ["Urban Blooms",       "4.3 ★", "89",  "Everyday & gifts",  "£20"],
    ["The Flower Factory", "4.2 ★", "154", "Corporate",         "£80"],
    ["Stems & Stories",    "4.1 ★", "67",  "Same-day delivery", "£30"]
  ]}
  winnerColumn={0}
/>
```

**Column selection rules:**
- Column 0: always business name
- Column 1: always rating (from `places_data`, format `"4.8 ★"`)
- Column 2: always review count (from `places_data`)
- Columns 3–5: pick 1–3 columns most relevant to this business type

| Business type | Good additional columns |
|---|---|
| Florists, caterers | Specialism, Min. Order, Delivery |
| Contractors, tradespeople | Services, Avg. Response, Guarantee |
| Lawyers, accountants | Practice Area, Initial Consult, Pricing |
| Restaurants | Cuisine, Avg. Price, Reservations |
| Agencies, consultants | Specialism, Project Size, Pricing Model |

`winnerColumn` always `0` for business listings (winner is the name column).

### 8. What to Look for When Hiring a {Business Type} (H2)

```mdx
## What to Look for When Hiring a Florist

[3–5 short paragraphs. Each covers one decision criterion. Write for someone making their first hire in this category. 200–300 words total.]
```

Each paragraph: name the criterion in bold, explain why it matters, give a concrete benchmark.

Example:
```mdx
## What to Look for When Hiring a Florist

**Google reviews and recency.** A 4.5+ rating with 50+ reviews is the baseline. More important than the average is the recency — check that there are reviews from the past 3 months. A business with 200 five-star reviews but nothing recent may have changed hands or declined in quality.

**Specialism match.** Florists who do wedding floristry are not necessarily the best choice for a same-day birthday bouquet, and vice versa. Match the florist's portfolio to your specific need before enquiring.

**Pricing transparency.** Reputable florists display price ranges on their website or respond promptly with a quote when asked. Vague pricing ("call for details") often leads to significantly higher final bills.

**Response time.** Test it. Send an enquiry via their website and note how long it takes. For time-sensitive occasions — weddings, corporate events — a florist who takes 48 hours to reply will take 48 hours to resolve problems on the day.

**Delivery coverage and cut-off times.** Confirm whether your postcode is covered, whether same-day delivery is available, and what the order cut-off time is. Many florists quote "London-wide delivery" but charge extra or decline orders in outer boroughs.
```

### 9. FAQ (H2)

```mdx
## Frequently Asked Questions

### How much does a florist cost in London?
[Direct answer. Lead with a price range. 2–3 sentences.]

### What should I ask a florist before booking?
[Direct answer. Bulleted list or 2–3 sentences.]
```

8–12 questions. Use H3 per question. Answers lead with the answer — never "it depends" or "that's a great question".

**Question formats that work for business listings:**
- "How much does a {business type} cost in {location}?"
- "How do I choose a good {business type}?"
- "What questions should I ask before hiring a {business type}?"
- "How far in advance should I book a {business type}?"
- "What's the difference between [type A] and [type B]?"
- "Are [business type] regulated / licensed in {location}?"
- "What are red flags when hiring a {business type}?"
- "Can I get a {business type} last-minute?"

### 10. Verdict (H2)

```mdx
## Verdict

[3–4 sentences. Name the top pick and give the one-sentence reason it leads. Acknowledge the runner-up and who it's best for. End with a clear next step for the reader.]
```

Example:
```mdx
## Verdict

Bloom & Stem is the best florist in London for most occasions — their combination of same-day delivery coverage, direct flower sourcing, and fast response to enquiries is unmatched by any other business on this list. For weddings specifically, Petal & Co. is the stronger choice: their dedicated coordinator and event-day management justify the higher minimum spend. If budget is the primary concern, Urban Blooms delivers reliable quality from £20. Start by sending enquiries to your top two picks and compare response times — that alone will tell you a lot about how the relationship will go.
```

---

## SEO Requirements

| Element | Rule |
|---|---|
| H1 | Set via `title` frontmatter — no H1 in body |
| Keyword | Appears in: excerpt, opening paragraph, How We Ranked H2, Verdict |
| Location | Appears in every section at least once |
| Word count | 1,500–2,500 words body (excluding frontmatter) |
| External links | Link business names and websites in per-business sections |
| Review counts | Always use exact figures from `places_data` — never round or invent |

---

## Featured Image HTML Template

1200×628px OG image. Substitute `{{title}}`, `{{category}}`, and `{{location}}` before rendering. Render with `@vercel/og` or `satori`.

```html
<div style="width:1200px;height:628px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#02274A 0%,#0a3d6b 50%,#02274A 100%);padding:80px;box-sizing:border-box;">
  <div style="display:flex;flex-direction:column;align-items:center;gap:24px;max-width:960px;text-align:center;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
      <div style="width:48px;height:3px;background:#3AA83C;border-radius:2px;"></div>
      <span style="color:#FDB926;font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">{{category}} · {{location}}</span>
      <div style="width:48px;height:3px;background:#3AA83C;border-radius:2px;"></div>
    </div>
    <h1 style="color:#FBFCF9;font-size:52px;font-weight:800;line-height:1.15;margin:0;letter-spacing:-1px;">{{title}}</h1>
    <p style="color:#94a3b8;font-size:20px;margin:0;font-weight:400;">BestThingReview.com</p>
  </div>
</div>
```

---

## CTA Banner HTML Template

1200×200px in-article banner. Insert in MDX after the comparison table as a linked image. Substitute `{{cta_text}}` and `{{button_text}}` before rendering.

```html
<div style="width:1200px;height:200px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#02274A 0%,#1477D1 100%);padding:0 72px;box-sizing:border-box;">
  <div style="display:flex;flex-direction:column;gap:6px;">
    <p style="color:#94a3b8;font-size:15px;margin:0;font-weight:400;letter-spacing:1px;text-transform:uppercase;">BestThingReview.com</p>
    <p style="color:#FBFCF9;font-size:28px;font-weight:700;margin:0;letter-spacing:-0.5px;">{{cta_text}}</p>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;background:#3AA83C;color:#fff;font-size:18px;font-weight:600;padding:16px 40px;border-radius:8px;white-space:nowrap;">{{button_text}}</div>
</div>
```

Insert in MDX after the comparison table:

```mdx
[![Find the best businesses near you](/images/cta/lifestyle-cta.png)](/lifestyle)
```

---

## Claude Prompt Template

```
You are an expert local business reviewer writing for BestThingReview.com.

Follow docs/article-generation-spec.md EXACTLY — section order, MDX components,
frontmatter schema, contact block format, and SEO requirements.

Generate a complete MDX article for:

Keyword:   {KEYWORD}
Category:  {CATEGORY}
Location:  {LOCATION}
Count:     {COUNT} businesses
Date:      {TODAY}

Real business data from Google Maps — use name, address, phone, website, rating,
and reviewCount verbatim. Do not invent or change any of these values:

{PASTE JSON FROM extract-maps.ts HERE}

Your job: write the description paragraph and customer quote for each business.
Do not invent ratings, review counts, addresses, phone numbers, or websites.

Output ONLY the complete .mdx file. No explanation, no fences, no commentary.
Save to: content/reviews/{CATEGORY}/{SLUG}.mdx
```

---

## Complete Example Article

```mdx
---
title: "10 Best Florists in London (2024) — Ranked by Reviews"
category: lifestyle
slug: best-florists-london-2024
excerpt: "We researched 34 florists across London to find the best for weddings, events, and everyday arrangements — ranked by Google reviews, response time, and service quality."
rating: 9.6
featured: false
publishedAt: "2024-05-27"
updatedAt: "2024-05-27"
---

Finding a reliable florist in London means navigating hundreds of shops with wildly varying quality, pricing, and reliability. We researched 34 florists across all major London boroughs, evaluating Google review score, review count, website transparency, delivery coverage, and response time to a test enquiry. This list covers the best options for weddings, corporate events, and everyday arrangements — ranked by overall quality and consistency.

<ScoreBreakdown
  topPick="Bloom & Stem"
  dimensions={[
    { label: "Service Quality", score: 9.8 },
    { label: "Value for Money", score: 9.2 },
    { label: "Response Time", score: 9.5 },
    { label: "Professionalism", score: 9.6 },
    { label: "Customer Satisfaction", score: 9.7 }
  ]}
/>

<ProsCons
  pros={[
    "Same-day delivery available across all London postcodes before noon",
    "Dedicated wedding coordinator included on bookings over £300",
    "Direct-sourced flowers from Dutch auction — noticeably fresher than competitors",
    "Fastest response time we tested — 18 minutes average on enquiry form"
  ]}
  cons={[
    "Premium pricing — 20–30% above mid-market",
    "Walk-in by appointment only — no drop-in browsing",
    "Minimum delivery order £45"
  ]}
/>

## How We Ranked These Florists

We ranked each florist on: Google Maps rating (minimum 4.0 to qualify), review count (minimum 20), website pricing transparency, delivery coverage and cut-off time, and response time to a test enquiry sent via contact form. Businesses with suspicious review patterns or no verifiable physical address were excluded regardless of rating.

## Our Top Picks

<PicksList picks={[
  { rank: 1, name: "Bloom & Stem",        score: 9.6, label: "Best Overall" },
  { rank: 2, name: "Petal & Co.",         score: 9.0, label: "Best for Weddings" },
  { rank: 3, name: "Urban Blooms",        score: 8.6, label: "Best Budget Option" },
  { rank: 4, name: "The Flower Factory",  score: 8.4, label: "Best for Corporate Events" },
  { rank: 5, name: "Stems & Stories",     score: 8.2, label: "Best for Same-Day Delivery" }
]} />

### 1. Bloom & Stem — Best Overall

Bloom & Stem has operated from their Shoreditch studio since 2011, specialising in bespoke event floristry and corporate installations. Their team of six designers handles everything from single bouquets to full wedding venue dressing across Greater London. Same-day delivery is available for orders placed before noon, with coverage across all London postcodes — rarer than most florists advertise. They source flowers directly from Dutch auction houses three times weekly, which explains both the freshness and the premium pricing. Responded to our test enquiry in 18 minutes — fastest of all businesses we contacted.

📍 **Address:** 47 Redchurch Street, London E2 7DJ\
📞 **Phone:** +44 20 7946 0847\
🌐 **Website:** [bloomsandstem.co.uk](https://bloomsandstem.co.uk)\
⭐ **Rating:** 4.8 (347 Google reviews)

> "Commissioned a full table arrangement for our company's annual dinner. The team arrived on time, set up without any fuss, and the flowers were still fresh three days later. Would not use anyone else for our events." — *James T. ★★★★★*

### 2. Petal & Co. — Best for Weddings

Petal & Co. focuses almost entirely on weddings and has built a strong reputation across London for understanding what couples actually want rather than what's trending on Instagram. Their initial consultation is complimentary and lasts up to 90 minutes. Portfolio spans traditional English garden styles to contemporary sculptural arrangements. They work with a small number of clients per weekend — typically three to five — which means your wedding receives dedicated attention. Pricing is higher than average but consistently transparent: itemised quotes are provided within 48 hours of consultation.

📍 **Address:** 12 Kensington Church Street, London W8 4EP\
📞 **Phone:** +44 20 7946 1293\
🌐 **Website:** [petalandco.london](https://petalandco.london)\
⭐ **Rating:** 4.7 (212 Google reviews)

> "Sarah at Petal & Co. understood exactly what I wanted from a single mood board. The bouquet, buttonholes, and table centrepieces were everything I'd imagined. I had three florists quote us — Petal & Co. was clearest on pricing and most confident in the brief." — *Emma R. ★★★★★*

### 3. Urban Blooms — Best Budget Option

Urban Blooms is the most accessible florist on this list. Operating out of two market stalls in Borough Market and Brixton Market, they sell finished arrangements rather than bespoke designs — which is why their pricing starts at £20. Quality is consistent for the price: seasonal flowers, simple packaging, reliable freshness. Same-day collection is available from both market locations seven days a week. No delivery option exists, and bespoke or event work is outside their scope, but for everyday gifting and home flowers, they're hard to beat at the price.

📍 **Address:** Borough Market, 8 Southwark Street, London SE1 1TL\
📞 **Phone:** +44 20 7946 0345\
⭐ **Rating:** 4.3 (89 Google reviews)

> "Bought flowers for my mum's birthday from the Borough Market stall. Beautiful mixed bouquet for £28 — the same quality I'd seen in florist shops for £55. They wrapped it properly too, not just a rubber band." — *Olivia M. ★★★★★*

### 4. The Flower Factory — Best for Corporate Events

The Flower Factory specialises in volume corporate work: weekly office arrangements, product launches, hotel lobbies, and branded event floristry. Their studio in Bermondsey runs a subscription service starting at £120 per month for weekly office deliveries. Account management is assigned per client, meaning you deal with the same person consistently — a real advantage for events where brief continuity matters. Not the right choice for weddings or one-off retail orders, but for corporate accounts they are the most reliable on this list.

📍 **Address:** 34 Bermondsey Street, London SE1 3UD\
📞 **Phone:** +44 20 7946 0512\
🌐 **Website:** [theflowerfactory.co.uk](https://theflowerfactory.co.uk)\
⭐ **Rating:** 4.2 (154 Google reviews)

> "We've used The Flower Factory for our weekly office arrangement for two years. The quality is consistent, the account manager knows our preferences without being told, and they've never missed a delivery. Exactly what you want from a business supplier." — *David L. ★★★★★*

### 5. Stems & Stories — Best for Same-Day Delivery

Stems & Stories operates as a same-day focused florist with an online-first model. Orders placed before 1pm are delivered the same day across Central and inner East London; orders before 3pm reach most South and West London postcodes. Their website is the most clearly designed of the group: filter by occasion, budget, and delivery time, and checkout in under two minutes. Arrangements are pre-designed rather than bespoke, which trades flexibility for speed and price consistency. Average delivery window quoted and hit: 2–4 hours.

📍 **Address:** 8 Broadway Market, London E8 4QJ\
🌐 **Website:** [stemsandstories.com](https://stemsandstories.com)\
⭐ **Rating:** 4.1 (67 Google reviews)

> "Forgot my partner's birthday. Ordered at 11am, flowers arrived at 1:30pm. Genuinely saved me. The arrangement looked exactly like the photo on the site and the delivery driver called ahead with an ETA." — *Marcus K. ★★★★★*

## How They Compare

<ComparisonTable
  headers={["Business", "Rating", "Reviews", "Specialism", "Min. Order"]}
  rows={[
    ["Bloom & Stem",       "4.8 ★", "347", "Events & weddings",  "£45"],
    ["Petal & Co.",        "4.7 ★", "212", "Weddings",           "£60"],
    ["Urban Blooms",       "4.3 ★", "89",  "Everyday & gifts",   "£20"],
    ["The Flower Factory", "4.2 ★", "154", "Corporate accounts", "£80"],
    ["Stems & Stories",    "4.1 ★", "67",  "Same-day delivery",  "£35"]
  ]}
  winnerColumn={0}
/>

## What to Look for When Hiring a Florist

**Google reviews and recency.** A 4.5+ rating with 50+ reviews is a reliable baseline — but recency matters more than the average. A florist with 200 reviews and nothing posted in the last 6 months may have changed hands or declined in quality. Prioritise businesses with consistent recent reviews.

**Specialism match.** Wedding floristry and corporate event floristry are not the same as a walk-in bouquet. Match the florist's portfolio to your specific need. If their website shows ten years of wedding work and you need a corporate installation, ask whether they've done it before — don't assume.

**Pricing transparency.** Legitimate florists display price ranges or respond promptly with itemised quotes. "Call for a quote" with no further information is a yellow flag. Vague pricing conversations often result in significantly higher final invoices.

**Response time.** Send a test enquiry and measure it. For any time-sensitive occasion, how quickly a florist responds to an initial enquiry tells you exactly how they'll communicate under pressure. Under 4 hours is acceptable; under 1 hour is excellent; over 24 hours is a pass.

**Delivery coverage and cut-off.** "London-wide delivery" often means Zone 1–2, with surcharges or refusals for outer postcodes. Confirm your specific postcode is covered, what the cut-off time is for same-day orders, and what happens if no one is home.

## Frequently Asked Questions

### How much do florists charge in London?
Everyday bouquets range from £20–£60. Bespoke arrangements start around £60–£100. Wedding floristry (bouquet, buttonholes, centrepieces) typically runs £500–£2,000+ depending on scale. Corporate weekly arrangements start around £80–£120 per delivery.

### How far in advance should I book a florist for a wedding?
6–12 months is standard for reputable London florists with limited weekend capacity. Booking under 3 months before the date significantly narrows your options and may eliminate the top-tier businesses.

### What questions should I ask before hiring a florist?
Ask: Do you have my date available? Can I see work from similar occasions? How are pricing and changes handled after booking? What happens if a flower type isn't available on the day? Do you handle setup and collection, or just delivery?

### Are florists in London regulated?
No formal licensing exists for florists in the UK. The Florist Association (TFA) operates a voluntary membership scheme with a code of conduct — membership indicates commitment to professional standards but is not required to operate.

### What's the difference between a florist and a flower market stall?
Florists provide design services — they take a brief, source specific flowers, and create bespoke arrangements. Market stalls sell pre-arranged or loose flowers at lower prices with no customisation. For everyday gifts, stalls are excellent value. For events and weddings, use a florist.

### Can I get same-day flowers delivered in London?
Yes — Bloom & Stem and Stems & Stories both offer same-day delivery on orders placed before noon to 1pm. Coverage varies by postcode. Always confirm your specific address is included before ordering.

### What are red flags when hiring a florist?
No physical address listed. No portfolio or only stock photography on their website. Prices significantly below market average with no explanation. Slow or non-responsive to initial enquiries. Reluctance to provide itemised quotes for event work.

### Do London florists deliver on weekends?
Most do, but often with a surcharge (£5–£15) and earlier cut-off times. Confirm weekend availability, cut-off time, and any surcharge before booking.

## Verdict

Bloom & Stem is the best florist in London for most occasions — their combination of full same-day coverage, direct flower sourcing, and under-20-minute response time to enquiries puts them ahead of every other business on this list. For weddings specifically, Petal & Co. is the stronger choice: the dedicated coordinator and disciplined client cap justify the higher spend. If budget is your constraint, Urban Blooms delivers honest quality from £20 without pretending to be something it isn't. Send enquiries to your top two candidates and compare response time — that single test will reveal more about each business than any review.
```

---

## Notes for Claude

- **Check `assets/featured-companies.txt` first.** Before ranking businesses, read this file. If any business in `places_data` matches a name in this list (case-insensitive), force it to rank 1 with "Best Overall" label and use a followed link (no `rel`). All other businesses get `rel="nofollow noopener noreferrer"` on their website links.
- **All website links use `<a>` HTML tags, not Markdown syntax.** This is required to support `rel` attributes.
- **Use `places_data` verbatim.** Names, addresses, phone numbers, websites, ratings, and review counts must come from the JSON exactly. Adjust description and customer quote only.
- **Omit fields that are null.** If `phone` is null in places_data, do not include the phone line. If `website` is null, do not include the website line.
- **Score = Google rating × 2.** A 4.8 Google rating = 9.6 score. Use the `rating` field from places_data multiplied by 2. Round to 1 decimal.
- **`rating` frontmatter = top business score.** Set frontmatter `rating` to the top-ranked business's computed score (after featured company re-ranking if applicable).
- **PicksList and H3 sections must be in identical order.** Rank 1 in PicksList = first H3.
- **ComparisonTable `winnerColumn` = 0** for business listings (business name column is always the winner column).
- **Never add H1 to body.** The page template renders `title` as H1 automatically.
- **Output only the MDX file.** No explanation, no wrapping code fences, no commentary.

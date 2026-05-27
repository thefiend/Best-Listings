# BestThingReview — Article Generation Spec

Claude follows this document to generate a complete "best-of" review article as an MDX file ready to drop into `content/reviews/{category}/`.

---

## Input

Claude needs at minimum:

| Input | Required | Notes |
|---|---|---|
| `keyword` | Yes | e.g. `"best robot vacuums 2024"` |
| `category` | Yes | One of: `tech` · `home` · `software` · `lifestyle` · `travel` |
| `count` | No | How many picks to include. Default 10 |
| `places_data` | No | JSON from `scripts/extract-maps.ts` — inject real business data when available |

---

## Output

A single `.mdx` file saved to:

```
content/reviews/{category}/{slug}.mdx
```

---

## Frontmatter Schema

Every article must include this exact frontmatter block:

```yaml
---
title: "Best Robot Vacuums of 2024: Our Top 10 Tested Picks"
category: home
slug: best-robot-vacuums-2024
excerpt: "We tested 18 robot vacuums over six weeks to find the best models for every home and budget — from budget picks to premium self-emptying units."
rating: 9.2
featured: false
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
---
```

**Field rules:**
- `title` — 50–65 chars. Front-load the keyword. Year optional but recommended.
- `category` — must be one of the 5 valid values exactly.
- `slug` — lowercase, hyphens, no special chars. Match URL you want to rank for.
- `excerpt` — 145–160 chars. Answer who this is for and what they'll find. Contains the target keyword.
- `rating` — overall score 0–10 for the top pick in the article.
- `featured` — set `true` only if this should appear on the homepage grid (use sparingly).
- `publishedAt` / `updatedAt` — today's date in `YYYY-MM-DD` format.

---

## Article Structure

Sections must appear in this exact order.

### 1. Opening paragraph

One paragraph, 3–4 sentences. Establish the problem ("choosing the right X is hard"), explain how this article solves it ("we tested N models"), and give readers a reason to keep reading. Contains the target keyword naturally.

```mdx
After testing 18 robot vacuums over six weeks, we found that most people overpay for features they don't need. The Roborock S8 Pro Ultra delivered the best balance of suction, mapping accuracy, and autonomous emptying. We also found strong budget options for smaller homes. Here's everything you need to know.
```

### 2. ScoreBreakdown (top pick)

Immediately after the opening paragraph, show the top pick's sub-scores:

```mdx
<ScoreBreakdown
  topPick="Roborock S8 Pro Ultra"
  dimensions={[
    { label: "Suction Power", score: 9.0 },
    { label: "Mapping Accuracy", score: 9.2 },
    { label: "Value for Money", score: 8.0 },
    { label: "Ease of Use", score: 8.5 }
  ]}
/>
```

Sub-scores must be consistent with the overall `rating` in frontmatter (within ±0.5).

### 3. ProsCons (top pick only)

```mdx
<ProsCons
  pros={[
    "Best mapping accuracy we tested",
    "Auto-empty dock works reliably",
    "Mop and vacuum in one pass",
    "Quiet at 58dB — usable in small apartments"
  ]}
  cons={[
    "Dock footprint is large (35cm × 35cm)",
    "App setup takes 20–30 minutes",
    "Expensive — premium over mid-range picks is real"
  ]}
/>
```

3–5 pros, 2–4 cons. Concrete and specific — never vague ("good performance", "pricey").

### 4. How we tested (H2)

```mdx
## How We Tested

[2–3 sentences explaining the testing methodology. What did you measure? How long? What environments?]
```

This section builds credibility. Keep it concise and factual.

### 5. Our Top Picks (H2)

```mdx
## Our Top Picks
```

Immediately followed by the PicksList component:

```mdx
<PicksList picks={[
  { rank: 1, name: "Roborock S8 Pro Ultra", score: 9.2, label: "Best Overall" },
  { rank: 2, name: "iRobot Roomba j7+", score: 8.3, label: "Best for Pet Hair" },
  { rank: 3, name: "Eufy RoboVac 11S", score: 7.8, label: "Best Budget" },
  { rank: 4, name: "Shark IQ Robot", score: 7.5, label: "Best Under $300" }
]} />
```

Labels must be distinct and descriptive. Never "Second Best" or "Runner-Up".

### 6. Per-pick sections (H3, repeated)

One H3 section per pick. Order must match PicksList ranking exactly.

```mdx
### 1. Roborock S8 Pro Ultra — Best Overall

[2–3 paragraphs. Cover: what makes it the best overall, key features, real-world performance, who it's best suited for. 150–250 words total.]

[If `places_data` provided: include address, phone, website, and rating from the real data.]
```

For business/service articles (restaurants, contractors, etc.) using `places_data`:

```mdx
### 1. Bloom & Stem — Best Overall

[Description paragraph 150–200 words.]

📍 **Address:** 123 Example St, London EC1A 1BB
📞 **Phone:** +44 20 7946 0958
🌐 **Website:** [bloomandstem.co.uk](https://bloomandstem.co.uk)
⭐ **Rating:** 4.8 (347 Google reviews)

> "Incredible service — ordered a custom bouquet for my wife's birthday and it arrived two hours early, perfectly packaged." — *Sarah M. ★★★★★*
```

Customer quote format: pull-quote (`>`), 1–2 sentences, specific praise, first name + last initial, star rating.

### 7. Comparison table (H2)

```mdx
## Full Comparison

<ComparisonTable
  headers={["Model", "Score", "Price", "Best For"]}
  rows={[
    ["Roborock S8 Pro Ultra", "9.2", "$1,399", "Best overall"],
    ["iRobot Roomba j7+", "8.3", "$599", "Pet hair"],
    ["Eufy RoboVac 11S", "7.8", "$149", "Budget"],
    ["Shark IQ Robot", "7.5", "$299", "Mid-range"]
  ]}
  winnerColumn={0}
/>
```

`winnerColumn` is 0-indexed. Set to the column that contains the top pick's distinguishing metric (usually column 0 = name, or the score column).

### 8. What to look for (H2)

```mdx
## What to Look For

[3–5 paragraphs covering the key buying criteria. Each paragraph focuses on one decision factor: e.g., suction power, battery life, mapping tech, price range. 200–350 words total.]
```

This section is SEO-valuable and answers long-tail queries. Write it for someone who doesn't know where to start.

### 9. FAQ (H2)

```mdx
## Frequently Asked Questions

### How often should you run a robot vacuum?
[Direct answer, 2–3 sentences.]

### Are robot vacuums worth it for pet hair?
[Direct answer, 2–3 sentences.]
```

8–12 questions. Use H3 for each question. Answers must be direct — lead with the answer, not "it depends".

Question formats that work:
- "Is X worth it for Y?"
- "What is the best X under $N?"
- "How long does X last?"
- "Can X do Y?"
- "What's the difference between X and Y?"

### 10. Verdict (H2)

```mdx
## Verdict

[3–4 sentences. Restate the top pick and why it won. Acknowledge the runner-up for a specific use case. Tell readers what to do next.]
```

---

## SEO Requirements

| Element | Rule |
|---|---|
| H1 | Set via `title` frontmatter — do not add a separate H1 in body |
| Keyword density | Target keyword appears in: excerpt, first paragraph, How We Tested H2, Verdict |
| Word count | 1,200–2,500 words for the body (excluding frontmatter) |
| Internal links | Not applicable — Next.js routing handles this |
| External links | Link out to manufacturer/official sites in per-pick sections using `[anchor](url)` |
| Alt text | Not needed — images are handled by the `coverImage` frontmatter field |

---

## Featured Image HTML Template

Used to generate the Open Graph image (`coverImage`) for the article. Dimensions: 1200×628px. Brand colors match BestThingReview palette.

Render with `@vercel/og` or `satori`. Substitute `{{title}}` and `{{category}}` before rendering.

```html
<div style="width:1200px;height:628px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#02274A 0%,#0a3d6b 50%,#02274A 100%);padding:80px;box-sizing:border-box;">
  <div style="display:flex;flex-direction:column;align-items:center;gap:24px;max-width:960px;text-align:center;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
      <div style="width:48px;height:3px;background:#3AA83C;border-radius:2px;"></div>
      <span style="color:#FDB926;font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">{{category}}</span>
      <div style="width:48px;height:3px;background:#3AA83C;border-radius:2px;"></div>
    </div>
    <h1 style="color:#FBFCF9;font-size:52px;font-weight:800;line-height:1.15;margin:0;letter-spacing:-1px;">{{title}}</h1>
    <p style="color:#94a3b8;font-size:20px;margin:0;font-weight:400;">BestThingReview.com</p>
  </div>
</div>
```

---

## CTA Banner HTML Template

In-article CTA inserted after the comparison table. Dimensions: 1200×200px.

Substitute `{{cta_text}}` and `{{button_text}}` before rendering.

```html
<div style="width:1200px;height:200px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#02274A 0%,#1477D1 100%);padding:0 72px;box-sizing:border-box;">
  <div style="display:flex;flex-direction:column;gap:6px;">
    <p style="color:#94a3b8;font-size:15px;margin:0;font-weight:400;letter-spacing:1px;text-transform:uppercase;">BestThingReview.com</p>
    <p style="color:#FBFCF9;font-size:28px;font-weight:700;margin:0;letter-spacing:-0.5px;">{{cta_text}}</p>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;background:#3AA83C;color:#fff;font-size:18px;font-weight:600;padding:16px 40px;border-radius:8px;white-space:nowrap;">{{button_text}}</div>
</div>
```

In the MDX article body, include the CTA as a linked image after the comparison table:

```mdx
[![BestThingReview — Expert Reviews You Can Trust](/images/cta/home-cta.png)](/home)
```

---

## Claude Prompt Template

Copy this prompt and fill in `{KEYWORD}`, `{CATEGORY}`, `{COUNT}`, and optionally paste in Places data.

```
You are an expert product reviewer writing for BestThingReview.com.

Follow the article generation spec at docs/article-generation-spec.md EXACTLY —
structure, section order, MDX components, frontmatter schema, and SEO requirements.

Generate a complete MDX article for:

Keyword:   {KEYWORD}
Category:  {CATEGORY}
Count:     {COUNT} picks
Date:      {TODAY}

{PLACES_DATA_BLOCK}

Output ONLY the complete .mdx file — no explanation, no markdown fences, no commentary.
The file must be saved to: content/reviews/{CATEGORY}/{SLUG}.mdx
```

When `places_data` is available (from `scripts/extract-maps.ts`), include:

```
Real business data from Google Maps (use this — do not invent business details):
{paste JSON output from extract-maps.ts here}

Use the name, rating, reviewCount, address, phone, and website from this data verbatim.
Generate the description paragraphs yourself. Write a realistic customer quote per business.
```

---

## Complete Example Article

```mdx
---
title: "Best Robot Vacuums of 2024: Our Top 10 Tested Picks"
category: home
slug: best-robot-vacuums-2024
excerpt: "We tested 18 robot vacuums over six weeks to find the best models for every home and budget — from budget picks under $150 to premium self-emptying units."
rating: 9.2
featured: true
publishedAt: "2024-05-01"
updatedAt: "2024-05-15"
---

After testing 18 robot vacuums over six weeks, we found that most people overpay for features they don't need. The Roborock S8 Pro Ultra delivered the best balance of suction, mapping accuracy, and autonomous emptying — but strong budget options exist for smaller homes. We ran each vacuum through a standardised obstacle course, carpet and hardwood tests, and a 30-day live-in trial. Here's everything you need to know.

<ScoreBreakdown
  topPick="Roborock S8 Pro Ultra"
  dimensions={[
    { label: "Suction Power", score: 9.0 },
    { label: "Mapping Accuracy", score: 9.2 },
    { label: "Value for Money", score: 8.0 },
    { label: "Ease of Use", score: 8.5 }
  ]}
/>

<ProsCons
  pros={[
    "Best mapping accuracy we tested",
    "Auto-empty dock works reliably for 30+ days",
    "Mop and vacuum in a single pass",
    "Quiet enough for daytime use at 58dB"
  ]}
  cons={[
    "Large dock footprint (35cm × 35cm) — needs clear floor space",
    "App setup takes 20–30 minutes first time",
    "Premium price is real — significant jump over mid-range"
  ]}
/>

## How We Tested

We ran each vacuum across three home types (studio, 2-bed apartment, 3-bed house) for six weeks. Metrics captured: suction Pa at max setting, mapping time for first full run, obstacle avoidance accuracy (20-item course), dock reliability over 30 days, and noise level at 1 metre. All models tested on both carpet and hardwood.

## Our Top Picks

<PicksList picks={[
  { rank: 1, name: "Roborock S8 Pro Ultra", score: 9.2, label: "Best Overall" },
  { rank: 2, name: "iRobot Roomba j7+", score: 8.3, label: "Best for Pet Hair" },
  { rank: 3, name: "Eufy RoboVac 11S", score: 7.8, label: "Best Budget" },
  { rank: 4, name: "Shark IQ Robot XL", score: 7.5, label: "Best Under $300" }
]} />

### 1. Roborock S8 Pro Ultra — Best Overall

The S8 Pro Ultra topped every test category we ran. Its 6,000Pa suction cleared even embedded pet hair from thick carpet in a single pass, while the reactive obstacle avoidance correctly identified and navigated around cables, socks, and shoes in our 20-item course. The self-emptying and self-cleaning dock works reliably — we ran it for 30 days without manually emptying or cleaning.

Battery life averages 180 minutes on auto mode, enough to cover a 2,000 sq ft home with room to spare. The app is the most polished we tested: room labelling, no-go zones, and scheduled mopping all work first time. Our main complaint is the dock size — it needs 35cm of clear floor space and can't tuck under furniture.

**Best for:** Larger homes (1,500+ sq ft), pet owners, anyone who wants to set it and forget it.

### 2. iRobot Roomba j7+ — Best for Pet Hair

No robot vacuum handles pet hair better than the j7+. The dual rubber brushes don't tangle, and PrecisionVision Navigation correctly identified and avoided our test dog's food bowl and toys 19/20 times in obstacle testing — a result no other model matched. The Clean Base dock empties reliably and uses sealed bags, which matters if anyone in your household has allergies.

Mapping accuracy is excellent (second only to the Roborock), and the app learns your schedule after 3–4 runs. At $599 it's significantly cheaper than the S8 Pro Ultra, and for pet hair specifically it closes the gap. The trade-off is no mopping capability.

**Best for:** Pet owners, allergy households, anyone prioritising obstacle avoidance.

### 3. Eufy RoboVac 11S — Best Budget

At $149 the 11S doesn't have smart mapping, room labelling, or a self-emptying dock. What it has is reliable, consistent vacuuming on a budget. 1,300Pa suction handles hardwood and low-pile carpet competently. The slim 2.85" profile fits under most sofas. Battery gives 100 minutes of runtime — sufficient for a 1-bed apartment.

You manage scheduling via the app or remote, not by room. The dustbin needs emptying every 2–3 runs. These are real compromises, but for the price there is no better-built option.

**Best for:** Small apartments, low-pile carpet or hardwood only, buyers on a strict budget.

### 4. Shark IQ Robot XL — Best Under $300

The IQ Robot XL threads the needle between budget and premium. At $279 you get smart mapping, room labelling, no-go zones, and a self-emptying dock — features that typically start at $400+. Suction is competitive at 2,200Pa, and mapping accuracy is good enough for most homes.

Obstacle avoidance is the weakest of our top-4. It struggled with dark-coloured objects and occasionally pushed lightweight items rather than navigating around them. For homes without many small floor obstacles, this is a non-issue.

**Best for:** Medium-sized homes wanting smart features without the premium price.

## Full Comparison

<ComparisonTable
  headers={["Model", "Score", "Price", "Suction (Pa)", "Self-Empty"]}
  rows={[
    ["Roborock S8 Pro Ultra", "9.2", "$1,399", "6,000", "Yes"],
    ["iRobot Roomba j7+", "8.3", "$599", "N/A*", "Yes"],
    ["Eufy RoboVac 11S", "7.8", "$149", "1,300", "No"],
    ["Shark IQ Robot XL", "7.5", "$279", "2,200", "Yes"]
  ]}
  winnerColumn={1}
/>

## What to Look For

**Suction power (Pa):** More isn't always better. 1,300Pa is sufficient for hardwood and low-pile carpet. For thick carpet or heavy pet hair, look for 3,000Pa+. Above 5,000Pa adds cost without meaningful gains for most homes.

**Smart mapping vs. random navigation:** Random-navigation models (like the 11S) cover the floor but can't learn room layouts, can't set no-go zones, and can't do targeted room cleaning. Smart mapping is worth paying for if you have 2+ rooms or want to clean specific areas on demand.

**Self-emptying dock:** Reduces your active maintenance from daily (emptying the bin after each run) to monthly (replacing the dock bag). Worth it for busy households. Adds $100–200 to the price.

**Combo mop-vacuum:** Useful if you have mostly hard floors. Current implementations work well for light maintenance mopping but won't replace a proper wet mop for sticky spills or deep cleaning.

**Obstacle avoidance tier:** Basic (bumps and reverses), mid (detects and navigates around objects > 5cm), premium (identifies object type, avoids cables and small items reliably). Pet owners should prioritise premium avoidance.

## Frequently Asked Questions

### Are robot vacuums worth it for pet hair?
Yes — particularly models with dual rubber brushes (not bristle brushes), which don't tangle. The iRobot Roomba j7+ is the strongest performer for pet hair in our testing.

### How long does a robot vacuum last?
Most quality robot vacuums last 4–6 years with regular maintenance (cleaning brushes, replacing filters, clearing sensors). Batteries typically need replacing after 2–3 years.

### Do robot vacuums work on thick carpet?
Mid-range and premium models do. Look for 3,000Pa+ suction and a high-speed brush roll. The Roborock S8 Pro Ultra performed best on thick carpet in our tests.

### Can a robot vacuum replace a regular vacuum?
For maintenance cleaning (2–3 times per week), yes. For deep cleaning (pulling furniture, stairs, upholstery), no. Most households use both.

### What's the difference between Roomba and Roborock?
iRobot Roomba strengths: best obstacle avoidance, strong pet hair performance, US-based support. Roborock strengths: higher suction, better combo mopping, more competitive pricing at the premium tier.

### How loud are robot vacuums?
Most run at 60–70dB on max — similar to a normal conversation or a clothes dryer. The Roborock S8 Pro Ultra is quieter at 58dB. Noise level drops significantly on auto/quiet mode.

### Should I run a robot vacuum every day?
For pet owners or dusty environments: yes, daily runs on auto mode. For regular households: 3–4 times per week is sufficient. Self-emptying models make daily running practical.

### What area can a robot vacuum cover on one charge?
Most mid-range models cover 1,500–2,000 sq ft per charge. Premium models (Roborock S8) cover 3,000+ sq ft. For large homes, prioritise battery life (150+ minutes) and recharge-and-resume capability.

## Verdict

The Roborock S8 Pro Ultra is the best robot vacuum we've tested for most people — the mapping, suction, and self-cleaning dock are genuinely ahead of the competition. If pet hair is your primary concern and you want to save $800, the iRobot Roomba j7+ closes the gap significantly. On a budget, the Eufy RoboVac 11S is the most honest $149 robot vacuum we've found: it doesn't pretend to do more than it does.
```

---

## Notes for Claude

- **Do not hallucinate ratings or review counts.** If no `places_data` is provided, describe products/services accurately and use plausible specifications — but do not invent specific star ratings or Google review counts.
- **Scores must be internally consistent.** If the overall `rating` is 9.2, the sub-scores in ScoreBreakdown should average approximately 9.2 (±0.5).
- **PicksList and per-pick H3 sections must be in the same order.** If rank 1 in PicksList is "Product A", the first H3 must be "1. Product A — Label".
- **ComparisonTable `winnerColumn` is 0-indexed.** Column 0 = first column header.
- **Never add a H1 to the body.** The page template renders `title` as H1 automatically.
- **Output only the MDX file.** No explanation, no wrapping code fences, no "here is the article".

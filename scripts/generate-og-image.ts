#!/usr/bin/env npx tsx
/**
 * generate-og-image.ts — Generate featured image or CTA banner for BestThingReview articles
 *
 * Uses satori (JSX → SVG) + @resvg/resvg-js (SVG → PNG). No browser required.
 *
 * Usage:
 *   # From MDX article file (reads title/category/location from frontmatter)
 *   npx tsx scripts/generate-og-image.ts --article content/reviews/business/best-seo-agency-singapore-2026.mdx
 *
 *   # Explicit params
 *   npx tsx scripts/generate-og-image.ts --title "10 Best SEO Agencies in Singapore" --category "Business" --location "Singapore"
 *
 *   # CTA banner (1200×200)
 *   npx tsx scripts/generate-og-image.ts --type cta --cta-text "Find the best businesses near you" --button "Explore Now" --output public/images/cta/business-cta.png
 *
 * Output:
 *   Featured image → public/images/og/{slug}.png  (or --output)
 *   CTA banner     → public/images/cta/{slug}.png (or --output)
 *
 * Fonts are fetched from Google Fonts on first run and cached in .superpowers/fonts/
 */

import { parseArgs } from 'node:util'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import matter from 'gray-matter'

// Load .env.local automatically
function loadEnvLocal() {
  const envPath = join(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}
loadEnvLocal()
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

// ── Fonts (loaded from @fontsource/inter — no network required) ───────────────

type FontWeight = 100|200|300|400|500|600|700|800|900

function loadFont(weight: FontWeight): { name: string; data: ArrayBuffer; weight: FontWeight; style: 'normal' } {
  const fontPath = join(
    process.cwd(),
    'node_modules/@fontsource/inter/files',
    `inter-latin-${weight}-normal.woff`
  )
  const data = readFileSync(fontPath).buffer as ArrayBuffer
  return { name: 'Inter', data, weight, style: 'normal' }
}

// ── Templates ─────────────────────────────────────────────────────────────────

function featuredImageElement(title: string, category: string, location?: string) {
  const eyebrow = location ? `${category} · ${location}` : category

  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '628px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #02274A 0%, #0a3d6b 50%, #02274A 100%)',
        padding: '80px',
        boxSizing: 'border-box' as const,
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              gap: '24px',
              maxWidth: '960px',
              textAlign: 'center' as const,
            },
            children: [
              // Green bar + category eyebrow
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  },
                  children: [
                    { type: 'div', props: { style: { width: '48px', height: '3px', background: '#3AA83C', borderRadius: '2px' }, children: '' } },
                    {
                      type: 'span',
                      props: {
                        style: {
                          color: '#FDB926',
                          fontSize: '14px',
                          fontWeight: 700,
                          letterSpacing: '3px',
                          textTransform: 'uppercase' as const,
                        },
                        children: eyebrow,
                      },
                    },
                    { type: 'div', props: { style: { width: '48px', height: '3px', background: '#3AA83C', borderRadius: '2px' }, children: '' } },
                  ],
                },
              },
              // Title
              {
                type: 'div',
                props: {
                  style: {
                    color: '#FBFCF9',
                    fontSize: '52px',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    margin: '0',
                    letterSpacing: '-1px',
                    textAlign: 'center' as const,
                  },
                  children: title,
                },
              },
              // Site name
              {
                type: 'div',
                props: {
                  style: {
                    color: '#94a3b8',
                    fontSize: '20px',
                    margin: '0',
                    fontWeight: 400,
                  },
                  children: 'BestThingReview.com',
                },
              },
            ],
          },
        },
      ],
    },
  }
}

function ctaBannerElement(ctaText: string, buttonText: string) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #02274A 0%, #1477D1 100%)',
        padding: '0 72px',
        boxSizing: 'border-box' as const,
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    color: '#94a3b8',
                    fontSize: '15px',
                    margin: '0',
                    fontWeight: 400,
                    letterSpacing: '1px',
                    textTransform: 'uppercase' as const,
                  },
                  children: 'BestThingReview.com',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    color: '#FBFCF9',
                    fontSize: '28px',
                    fontWeight: 700,
                    margin: '0',
                    letterSpacing: '-0.5px',
                  },
                  children: ctaText,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#3AA83C',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              padding: '16px 40px',
              borderRadius: '8px',
              whiteSpace: 'nowrap' as const,
            },
            children: buttonText,
          },
        },
      ],
    },
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

async function renderToPng(element: object, width: number, height: number): Promise<Buffer> {
  const fonts = [loadFont(400), loadFont(700), loadFont(800)]

  const svg = await satori(element as any, { width, height, fonts })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
  return Buffer.from(resvg.render().asPng())
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      article:  { type: 'string',  short: 'a' },
      title:    { type: 'string',  short: 't' },
      category: { type: 'string',  short: 'c' },
      location: { type: 'string',  short: 'l' },
      type:     { type: 'string',  default: 'og' },     // 'og' | 'cta'
      'cta-text': { type: 'string', default: process.env.CTA_DESCRIPTION ?? 'Find the best businesses near you' },
      button:   { type: 'string',  default: process.env.CTA_BUTTON_TEXT ?? 'Explore Now' },
      output:   { type: 'string',  short: 'o' },
    },
    allowPositionals: true,
  })

  const imageType = (values.type as string) === 'cta' ? 'cta' : 'og'

  // ── CTA banner mode ──
  if (imageType === 'cta') {
    const ctaText = values['cta-text'] as string
    const buttonText = values.button as string
    const outPath = (values.output as string | undefined) ?? autoOutputPath('cta', ctaText)

    log(`Generating CTA banner: "${ctaText}"`)
    const element = ctaBannerElement(ctaText, buttonText)
    const png = await renderToPng(element, 1200, 200)

    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, png)
    log(`Saved: ${outPath}`)
    process.stdout.write(outPath + '\n')
    return
  }

  // ── Featured image mode ──
  let title: string
  let category: string
  let location: string | undefined

  if (values.article) {
    // Read from MDX frontmatter
    const articlePath = values.article as string
    const raw = readFileSync(articlePath, 'utf8')
    const { data } = matter(raw)

    title    = (values.title    as string | undefined) ?? data.title    ?? ''
    category = (values.category as string | undefined) ?? capitalize(data.category ?? '')
    location = (values.location as string | undefined) ?? data.location ?? undefined

    if (!title) throw new Error(`No title found in ${articlePath} — add --title`)
  } else {
    title    = values.title    as string | undefined ?? ''
    category = values.category as string | undefined ?? ''
    location = values.location as string | undefined
    if (!title || !category) {
      console.error([
        'Usage: npx tsx scripts/generate-og-image.ts [options]',
        '',
        'Featured image (OG):',
        '  --article, -a  Path to MDX file (reads title/category from frontmatter)',
        '  --title, -t    Article title',
        '  --category, -c Category label (e.g. "Business")',
        '  --location, -l Location label (e.g. "Singapore")  [optional]',
        '  --output, -o   Output PNG path  [optional, auto-generated if omitted]',
        '',
        'CTA banner (1200×200):',
        '  --type cta',
        '  --cta-text     Banner headline text',
        '  --button       Button label (default: "Explore Now")',
        '  --output, -o   Output PNG path',
        '',
        'Examples:',
        '  npx tsx scripts/generate-og-image.ts --article content/reviews/business/best-seo-agency-singapore-2026.mdx',
        '  npx tsx scripts/generate-og-image.ts --title "10 Best Florists in London" --category "Lifestyle" --location "London"',
        '  npx tsx scripts/generate-og-image.ts --type cta --cta-text "Find the best agencies" --button "Browse Now" --output public/images/cta/business-cta.png',
      ].join('\n'))
      process.exit(1)
    }
  }

  const slug = toSlug(title)
  const outPath = (values.output as string | undefined) ?? `public/images/og/${slug}.png`

  log(`Generating OG image: "${title}"`)
  if (location) log(`Category: ${category} · ${location}`)
  else log(`Category: ${category}`)

  const element = featuredImageElement(title, category, location)
  const png = await renderToPng(element, 1200, 628)

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, png)
  log(`Saved: ${outPath}`)
  process.stdout.write(outPath + '\n')
}

function autoOutputPath(type: 'og' | 'cta', text: string): string {
  const slug = toSlug(text)
  return type === 'cta' ? `public/images/cta/${slug}.png` : `public/images/og/${slug}.png`
}

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function log(msg: string) {
  process.stderr.write(msg + '\n')
}

main().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})

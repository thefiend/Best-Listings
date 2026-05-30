/**
 * scripts/submit-index.ts
 * Pings IndexNow (Bing, Yandex) and Google sitemap for all site URLs.
 * Run manually: npx tsx scripts/submit-index.ts
 * Or triggered automatically via /api/submit-index after Vercel deploy.
 */
import * as dotenv from 'dotenv'
import { getAllReviews, getAllComparisons } from '../lib/content'

dotenv.config({ path: '.env.local' })

const BASE_URL = 'https://www.bestthingreview.com'
const INDEXNOW_KEY = process.env.INDEXNOW_KEY
const CATEGORIES = ['tech', 'home', 'business', 'lifestyle', 'travel']

function buildUrls(): string[] {
  const reviews = getAllReviews()
  const comparisons = getAllComparisons()
  return [
    BASE_URL,
    ...CATEGORIES.map(c => `${BASE_URL}/${c}`),
    ...reviews.map(r => `${BASE_URL}/${r.category}/${r.slug}`),
    ...comparisons.map(c => `${BASE_URL}/compare/${c.slug}`),
  ]
}

async function submitIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_KEY) {
    console.warn('INDEXNOW_KEY not set — skipping IndexNow')
    return
  }
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'www.bestthingreview.com',
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  })
  console.log(`IndexNow: ${res.status} (${urls.length} URLs)`)
}

async function pingGoogleSitemap(): Promise<void> {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`)
  const res = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`)
  console.log(`Google sitemap ping: ${res.status}`)
}

async function main() {
  const urls = buildUrls()
  console.log(`Submitting ${urls.length} URLs to IndexNow + Google...`)
  await Promise.all([submitIndexNow(urls), pingGoogleSitemap()])
  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })

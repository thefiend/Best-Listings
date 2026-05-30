import { NextResponse } from 'next/server'
import { getAllReviews, getAllComparisons } from '@/lib/content'

const BASE_URL = 'https://www.bestthingreview.com'
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

async function submitIndexNow(urls: string[], key: string): Promise<number> {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'www.bestthingreview.com',
      key,
      keyLocation: `${BASE_URL}/${key}.txt`,
      urlList: urls,
    }),
  })
  return res.status
}

async function pingGoogleSitemap(): Promise<number> {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`)
  const res = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`)
  return res.status
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token || token !== process.env.SUBMIT_INDEX_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const indexNowKey = process.env.INDEXNOW_KEY
  if (!indexNowKey) {
    return NextResponse.json({ error: 'INDEXNOW_KEY not configured' }, { status: 500 })
  }

  const urls = buildUrls()
  const [indexNowStatus, googleStatus] = await Promise.all([
    submitIndexNow(urls, indexNowKey),
    pingGoogleSitemap(),
  ])

  return NextResponse.json({
    urls: urls.length,
    indexNow: indexNowStatus,
    google: googleStatus,
  })
}

#!/usr/bin/env npx tsx
/**
 * extract-maps.ts — Extract top Google Maps results using the Places API (New)
 *
 * API: https://places.googleapis.com/v1/places:searchText
 * Enable in GCP Console: "Places API (New)" (not legacy "Places API")
 *
 * Usage:
 *   GOOGLE_MAPS_KEY=xxx npx tsx scripts/extract-maps.ts "best seo agency singapore" --count 10
 *   npx tsx scripts/extract-maps.ts "florists london" --count 10 --output results.json
 *
 * Output: JSON array — rank, name, address, phone, website, rating, reviewCount, types, placeId
 *
 * Options:
 *   --count, -n    Number of results (default: 10, max: 60)
 *   --key, -k      Google Maps API key (or set GOOGLE_MAPS_KEY env var)
 *   --output, -o   Save to file instead of stdout
 *   --location     Bias results toward lat,lng e.g. "1.3521,103.8198" for Singapore
 *   --radius       Location bias radius in metres (default: 50000)
 */

import { parseArgs } from 'node:util'
import { writeFileSync } from 'node:fs'

const PLACES_NEW_URL = 'https://places.googleapis.com/v1/places:searchText'

// Fields to request — covers all data we need in one call (no separate details request)
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.types',
  'places.businessStatus',
  'nextPageToken',
].join(',')

export interface PlaceResult {
  rank: number
  name: string
  address: string
  rating: number | null
  reviewCount: number | null
  website: string | null
  phone: string | null
  types: string[]
  placeId: string
  googleMapsUrl: string
}

interface SearchOptions {
  query: string
  key: string
  count: number
  location?: string
  radius: number
  pageToken?: string
}

async function searchPlaces(opts: SearchOptions): Promise<{ places: PlaceResult[]; nextPageToken?: string }> {
  const body: Record<string, unknown> = {
    textQuery: opts.query,
    maxResultCount: Math.min(opts.count, 20), // API max per page is 20
  }

  if (opts.location) {
    const [lat, lng] = opts.location.split(',').map(Number)
    body.locationBias = {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: opts.radius,
      },
    }
  }

  if (opts.pageToken) {
    body.pageToken = opts.pageToken
  }

  const res = await fetch(PLACES_NEW_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': opts.key,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    const msg = data?.error?.message ?? `HTTP ${res.status}`
    const status = data?.error?.status ?? ''
    if (status === 'PERMISSION_DENIED' || res.status === 403) {
      throw new Error(
        `API key rejected (${status}): ${msg}\n` +
        `  → In Google Cloud Console, enable "Places API (New)" (not legacy "Places API").\n` +
        `  → Key: console.cloud.google.com → APIs & Services → Enable APIs`
      )
    }
    throw new Error(`Places API (New): ${msg}`)
  }

  const results: PlaceResult[] = (data.places ?? []).map((p: any, i: number) => ({
    rank: i + 1, // will be reassigned by caller
    name: p.displayName?.text ?? '',
    address: p.formattedAddress ?? '',
    rating: p.rating ?? null,
    reviewCount: p.userRatingCount ?? null,
    website: p.websiteUri ?? null,
    phone: p.internationalPhoneNumber ?? p.nationalPhoneNumber ?? null,
    types: (p.types ?? []).filter((t: string) =>
      !['point_of_interest', 'establishment'].includes(t)
    ),
    placeId: p.id ?? '',
    googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.id}`,
  }))

  return { places: results, nextPageToken: data.nextPageToken }
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      count:    { type: 'string', short: 'n', default: '10' },
      key:      { type: 'string', short: 'k' },
      output:   { type: 'string', short: 'o' },
      location: { type: 'string' },
      radius:   { type: 'string', default: '50000' },
    },
    allowPositionals: true,
  })

  const query = positionals[0]
  if (!query) {
    console.error([
      'Usage: npx tsx scripts/extract-maps.ts <query> [options]',
      '',
      'Options:',
      '  --count, -n    Number of results (default: 10, max: 60)',
      '  --key, -k      API key (or set GOOGLE_MAPS_KEY env var)',
      '  --output, -o   Save JSON to file instead of stdout',
      '  --location     Bias results: "lat,lng" — e.g. "1.3521,103.8198" (Singapore)',
      '  --radius       Location bias radius in metres (default: 50000)',
      '',
      'Examples:',
      '  npx tsx scripts/extract-maps.ts "best seo agency singapore" --count 10',
      '  npx tsx scripts/extract-maps.ts "florists london" --count 10 --output florists.json',
      '  npx tsx scripts/extract-maps.ts "plumbers" --location "51.5074,-0.1278" --count 10',
      '',
      'Requires: "Places API (New)" enabled in Google Cloud Console',
      '  console.cloud.google.com → APIs & Services → Enable APIs',
    ].join('\n'))
    process.exit(1)
  }

  const key = (values.key as string | undefined) ?? process.env.GOOGLE_MAPS_KEY
  if (!key) {
    console.error('Error: API key required. Set GOOGLE_MAPS_KEY env var or use --key')
    process.exit(1)
  }

  const count = Math.min(parseInt(values.count as string, 10) || 10, 60)
  const location = values.location as string | undefined
  const radius = parseInt(values.radius as string, 10)

  log(`Searching: "${query}" — top ${count} results...`)
  if (location) log(`Location bias: ${location} (radius: ${radius}m)`)

  const allPlaces: PlaceResult[] = []
  let pageToken: string | undefined

  while (allPlaces.length < count) {
    const { places, nextPageToken } = await searchPlaces({
      query,
      key,
      count: count - allPlaces.length,
      location,
      radius,
      pageToken,
    })

    for (const place of places) {
      if (allPlaces.length >= count) break
      allPlaces.push({ ...place, rank: allPlaces.length + 1 })
    }

    pageToken = nextPageToken
    if (!pageToken || places.length === 0) break

    // Brief pause between paginated requests
    await sleep(500)
  }

  if (allPlaces.length === 0) {
    log('No results found. Try a different query or remove --location bias.')
    process.exit(0)
  }

  log(`Found ${allPlaces.length} businesses.`)

  const json = JSON.stringify(allPlaces, null, 2)

  const outputFile = values.output as string | undefined
  if (outputFile) {
    writeFileSync(outputFile, json, 'utf8')
    log(`Saved to ${outputFile}`)
  } else {
    process.stdout.write(json + '\n')
  }
}

function log(msg: string) {
  process.stderr.write(msg + '\n')
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

main().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})

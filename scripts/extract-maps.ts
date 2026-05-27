#!/usr/bin/env npx tsx
/**
 * extract-maps.ts — Extract top Google Maps results for a search query
 *
 * Usage:
 *   GOOGLE_MAPS_KEY=xxx npx tsx scripts/extract-maps.ts "best florists london" --count 10
 *   npx tsx scripts/extract-maps.ts "best coffee shops NYC" --count 5 --details --output results.json
 *
 * Output: JSON array of places with rank, name, rating, reviewCount, address, phone, website
 *
 * Options:
 *   --count, -n    Number of results (default: 10, max: 60)
 *   --key, -k      Google Maps API key (or set GOOGLE_MAPS_KEY env var)
 *   --details, -d  Fetch phone + website via Place Details API (uses extra quota)
 *   --output, -o   Save to file instead of stdout
 *   --location     Bias results toward lat,lng (e.g. "51.5074,-0.1278" for London)
 *   --radius       Radius in metres for location bias (default: 50000)
 */

import { parseArgs } from 'node:util'
import { writeFileSync } from 'node:fs'

const TEXT_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
const PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json'

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

async function fetchTextSearch(
  query: string,
  key: string,
  location?: string,
  radius?: number,
  pageToken?: string,
): Promise<{ results: any[]; nextPageToken?: string }> {
  const params = new URLSearchParams({ query, key })
  if (location) params.set('location', location)
  if (radius) params.set('radius', String(radius))
  if (pageToken) params.set('pagetoken', pageToken)

  const res = await fetch(`${TEXT_SEARCH_URL}?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

  const data = await res.json()

  if (data.status === 'REQUEST_DENIED') {
    throw new Error(`API key rejected: ${data.error_message}`)
  }
  if (data.status === 'OVER_QUERY_LIMIT') {
    throw new Error('Google Maps quota exceeded')
  }
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API: ${data.status} — ${data.error_message ?? ''}`)
  }

  return {
    results: data.results ?? [],
    nextPageToken: data.next_page_token,
  }
}

async function fetchPlaceDetails(
  placeId: string,
  key: string,
): Promise<{ website: string | null; phone: string | null }> {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'website,formatted_phone_number',
    key,
  })

  try {
    const res = await fetch(`${PLACE_DETAILS_URL}?${params}`)
    if (!res.ok) return { website: null, phone: null }
    const data = await res.json()
    return {
      website: data.result?.website ?? null,
      phone: data.result?.formatted_phone_number ?? null,
    }
  } catch {
    return { website: null, phone: null }
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      count:    { type: 'string',  short: 'n', default: '10' },
      key:      { type: 'string',  short: 'k' },
      details:  { type: 'boolean', short: 'd', default: false },
      output:   { type: 'string',  short: 'o' },
      location: { type: 'string' },
      radius:   { type: 'string',  default: '50000' },
    },
    allowPositionals: true,
  })

  const query = positionals[0]
  if (!query) {
    console.error([
      'Usage: npx tsx scripts/extract-maps.ts <query> [options]',
      '',
      'Options:',
      '  --count, -n    Number of results (default: 10)',
      '  --key, -k      Google Maps API key (or GOOGLE_MAPS_KEY env)',
      '  --details, -d  Fetch phone + website per place (extra quota)',
      '  --output, -o   Save JSON to file',
      '  --location     Bias results: "lat,lng" e.g. "51.5074,-0.1278"',
      '  --radius       Location bias radius in metres (default: 50000)',
      '',
      'Examples:',
      '  npx tsx scripts/extract-maps.ts "best robot vacuums" --count 10',
      '  npx tsx scripts/extract-maps.ts "florists london" --count 10 --details --output florists.json',
      '  npx tsx scripts/extract-maps.ts "coffee shops" --location "51.5074,-0.1278" --count 10 --details',
    ].join('\n'))
    process.exit(1)
  }

  const key = (values.key as string | undefined) ?? process.env.GOOGLE_MAPS_KEY
  if (!key) {
    console.error('Error: Google Maps API key required.\n  Set GOOGLE_MAPS_KEY env var or use --key')
    process.exit(1)
  }

  const count = Math.min(parseInt(values.count as string, 10) || 10, 60)
  const fetchDetails = values.details as boolean
  const location = values.location as string | undefined
  const radius = parseInt(values.radius as string, 10)

  log(`Searching: "${query}" — fetching top ${count} results...`)
  if (location) log(`Location bias: ${location} (radius: ${radius}m)`)
  if (fetchDetails) log('Details mode: fetching phone + website per place (slower)')

  const places: PlaceResult[] = []
  let pageToken: string | undefined

  while (places.length < count) {
    if (pageToken) {
      // Places API requires a short delay before using next_page_token
      log(`Fetching next page...`)
      await sleep(2000)
    }

    const { results, nextPageToken } = await fetchTextSearch(query, key, location, radius, pageToken)

    for (const place of results) {
      if (places.length >= count) break

      let website: string | null = null
      let phone: string | null = null

      if (fetchDetails && place.place_id) {
        const details = await fetchPlaceDetails(place.place_id, key)
        website = details.website
        phone = details.phone
        // Respect rate limits
        await sleep(100)
      }

      places.push({
        rank: places.length + 1,
        name: place.name,
        address: place.formatted_address ?? '',
        rating: place.rating ?? null,
        reviewCount: place.user_ratings_total ?? null,
        website,
        phone,
        types: (place.types ?? []).filter((t: string) => !t.startsWith('point_of_interest')),
        placeId: place.place_id,
        googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      })
    }

    pageToken = nextPageToken
    if (!pageToken) break
  }

  if (places.length === 0) {
    log('No results found. Try a different query or remove --location bias.')
    process.exit(0)
  }

  log(`Found ${places.length} places.`)

  const json = JSON.stringify(places, null, 2)

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

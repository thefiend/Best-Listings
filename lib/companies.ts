// lib/companies.ts
import fs from 'fs'
import path from 'path'
import { getAllReviews } from './content'
import { Company } from './types'
import { slugify } from './toc'

interface CompanyDataEntry {
  services: string[]
  highlights: string[]
}

function loadCompanyData(baseDir = process.cwd()): Record<string, CompanyDataEntry> {
  const filePath = path.join(baseDir, 'lib', 'company-data.json')
  if (!fs.existsSync(filePath)) return {}
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return {}
  }
}

const SERVICE_KEYWORDS: Record<string, [string, string[]][]> = {
  'best-aircon-cleaning': [
    ['General Servicing',   ['general serv', 'maintenance', 'quarterly']],
    ['Chemical Wash',       ['chemical wash', 'chemical clean']],
    ['Chemical Overhaul',   ['chemical overhaul', 'strip-down', 'deep clean']],
    ['Gas Top-Up',          ['gas top-up', 'gas refill', 'refrigerant']],
    ['Installation',        ['installation', 'install', 'dismantl']],
    ['Repair',              ['repair', 'troubleshoot', 'fault', 'capacitor', 'compressor']],
    ['Commercial Systems',  ['commercial', 'vrv', 'chilled water', 'office', 'retail']],
    ['Residential',         ['residential', 'hdb', 'condo', 'landed', 'home']],
  ],
  'best-bhutan-travel-agency': [
    ['Tour Packages',    ['tour package', 'itinerary', 'package']],
    ['Visa Assistance',  ['visa', 'permit']],
    ['Hotel Booking',    ['hotel', 'accommodation', 'lodge']],
    ['Airport Transfers',['airport transfer', 'pickup', 'arrival']],
    ['Cultural Tours',   ['cultural', 'monastery', 'dzong', 'festival', 'temple']],
    ['Trekking',         ['trek', 'hike', 'walking trail']],
    ['Custom Tours',     ['custom', 'tailor', 'bespoke', 'private']],
  ],
  'best-chauffeur-service': [
    ['Airport Transfers', ['airport transfer', 'airport pickup', 'arrival', 'departure']],
    ['Corporate Travel',  ['corporate', 'business travel', 'executive', 'roadshow']],
    ['Wedding Cars',      ['wedding', 'bridal', 'solemnisation']],
    ['Hourly Hire',       ['hourly', 'by the hour', 'disposal']],
    ['Long Distance',     ['long distance', 'malaysia', 'johor', 'jb', 'cross-border']],
    ['Maxi Cab',          ['maxi cab', 'maxicab', '7-seater', '13-seater', 'minibus']],
    ['Limousine',         ['limousine', 'limo', 'luxury sedan', 'mercedes', 'bmw']],
  ],
  'best-home-renovation': [
    ['Interior Design',  ['interior design', 'id firm', 'design concept']],
    ['Carpentry',        ['carpentry', 'wardrobe', 'cabinet', 'built-in']],
    ['Electrical',       ['electrical', 'wiring', 'lighting', 'power point']],
    ['Plumbing',         ['plumbing', 'pipe', 'bathroom', 'toilet', 'sanitary']],
    ['Tiling',           ['tiling', 'tile', 'flooring', 'vinyl']],
    ['Painting',         ['painting', 'paint', 'colour']],
    ['False Ceiling',    ['false ceiling', 'gypsum', 'cornice']],
    ['Full Renovation',  ['full renovation', 'turnkey', 'whole-house', 'hacking']],
  ],
  'best-renovation-contractor': [
    ['Full Renovation',  ['full renovation', 'turnkey', 'whole-house', 'hacking']],
    ['Carpentry',        ['carpentry', 'wardrobe', 'cabinet', 'built-in']],
    ['Tiling',           ['tiling', 'tile', 'flooring']],
    ['Electrical',       ['electrical', 'wiring', 'lighting']],
    ['Plumbing',         ['plumbing', 'bathroom', 'pipe']],
    ['False Ceiling',    ['false ceiling', 'gypsum']],
    ['Painting',         ['painting', 'paint']],
    ['Waterproofing',    ['waterproof', 'wet area', 'ponding']],
  ],
  'best-roof-contractors': [
    ['Roof Repair',       ['roof repair', 'leaking roof', 'patch', 'monsoon']],
    ['Waterproofing',     ['waterproof', 'membrane', 'sealant']],
    ['Metal Roofing',     ['metal roof', 'zinc roof', 'steel']],
    ['Polycarbonate',     ['polycarbonate', 'skylight', 'transparent']],
    ['Roof Replacement',  ['roof replacement', 'reroofing', 're-roofing', 'new roof']],
    ['Roof Inspection',   ['inspection', 'assessment', 'survey', 'audit']],
    ['Residential',       ['residential', 'landed', 'terrace', 'semi-detached']],
    ['Commercial',        ['commercial', 'industrial', 'factory', 'warehouse']],
  ],
  'best-seo-agency': [
    ['SEO',                  ['seo', 'organic ranking', 'organic traffic', 'search engine optimis']],
    ['SEM / Google Ads',     ['sem', 'google ads', 'paid search', 'ppc']],
    ['Content Marketing',    ['content marketing', 'content strategy', 'blog']],
    ['Social Media',         ['social media', 'facebook', 'instagram']],
    ['Web Design',           ['web design', 'website design', 'web development']],
    ['Performance Marketing',['performance marketing', 'digital marketing', 'full-stack']],
    ['E-commerce',           ['e-commerce', 'ecommerce', 'shopify', 'woocommerce']],
  ],
  'best-seo-company': [
    ['SEO',                  ['seo', 'organic ranking', 'organic traffic', 'search engine optimis']],
    ['SEM / Google Ads',     ['sem', 'google ads', 'paid search', 'ppc']],
    ['Content Marketing',    ['content marketing', 'content strategy']],
    ['Social Media',         ['social media', 'facebook', 'instagram']],
    ['Web Design',           ['web design', 'website design']],
    ['Performance Marketing',['performance marketing', 'digital marketing']],
    ['E-commerce',           ['e-commerce', 'ecommerce', 'shopify']],
  ],
}

function extractServices(articleSlug: string, description: string): string[] {
  const lower = description.toLowerCase()
  const candidates = SERVICE_KEYWORDS[articleSlug] ?? []
  return candidates
    .filter(([, keywords]) => keywords.some(kw => lower.includes(kw)))
    .map(([label]) => label)
    .slice(0, 6)
}

function buildHighlights(rank: number, label: string, rating: number, reviewCount: number, address?: string): string[] {
  return [
    `#${rank} ${label}`,
    `${rating.toFixed(1)} / 5.0 Google Rating`,
    `${reviewCount.toLocaleString()} Verified Google Reviews`,
    ...(address ? ['Singapore Based'] : []),
  ]
}

function getProp(propsStr: string, key: string): string | undefined {
  const m = propsStr.match(new RegExp(`${key}="([^"]*)"`) )
  return m ? m[1] : undefined
}

function getNumProp(propsStr: string, key: string): number | undefined {
  const m = propsStr.match(new RegExp(`${key}=\\{([\\d.]+)\\}`))
  return m ? parseFloat(m[1]) : undefined
}

function getIntProp(propsStr: string, key: string): number | undefined {
  const m = propsStr.match(new RegExp(`${key}=\\{(\\d+)\\}`))
  return m ? parseInt(m[1]) : undefined
}

function parseCompaniesFromContent(
  content: string,
  sourceArticle: { title: string; slug: string; category: string }
): Company[] {
  // Split on business anchor tags
  const sections = content.split(/(?=<a id="business-\d+"><\/a>)/)
  const companies: Company[] = []

  for (const section of sections) {
    if (!section.includes('<a id="business-')) continue

    // Heading: ### N. Company Name, Label
    const headingMatch = section.match(/^### (\d+)\. ([^,\n]+),\s*(.+)/m)
    if (!headingMatch) continue

    const rank = parseInt(headingMatch[1])
    const name = headingMatch[2].trim()
    const label = headingMatch[3].trim()

    // Description: between heading and first 📍
    const descMatch = section.match(/### \d+\. [^\n]+\n+([\s\S]+?)\n+📍/)
    const description = descMatch
      ? descMatch[1].trim().replace(/\n+/g, ' ')
      : ''

    // CompanyRating props
    const ratingMatch = section.match(/<CompanyRating ([^/]+)\/>/)
    if (!ratingMatch) continue
    const propsStr = ratingMatch[1]

    const rating = getNumProp(propsStr, 'rating')
    const reviewCount = getIntProp(propsStr, 'reviewCount')
    if (rating === undefined || reviewCount === undefined) continue

    const address = getProp(propsStr, 'address')
    const postalCode = getProp(propsStr, 'postalCode')
    const phone = getProp(propsStr, 'phone')
    const businessType = getProp(propsStr, 'businessType') ?? 'LocalBusiness'

    // Website
    const websiteMatch = section.match(/🌐 \*\*Website:\*\* <a href="([^"]+)"/)
    const website = websiteMatch ? websiteMatch[1] : undefined

    // Email
    const emailMatch = section.match(/✉️ \*\*Email:\*\* <a href="mailto:([^"]+)"/)
    const email = emailMatch ? emailMatch[1] : undefined

    // Review quote and reviewer name
    const quoteMatch = section.match(/^> "([^"]+)"[^*]*\*([^★\n*]+)/m)
    const reviewQuote = quoteMatch ? quoteMatch[1].trim() : undefined
    const reviewerName = quoteMatch ? quoteMatch[2].trim().replace(/,\s*$/, '') : undefined

    companies.push({
      name,
      slug: slugify(name),
      rank,
      label,
      businessType,
      rating,
      reviewCount,
      address,
      postalCode,
      phone,
      email,
      website,
      description,
      reviewQuote,
      reviewerName,
      highlights: buildHighlights(rank, label, rating, reviewCount, address),
      services: extractServices(sourceArticle.slug, description),
      sourceArticle,
    })
  }

  return companies
}

let _cache: Company[] | null = null

export function getAllCompanies(baseDir = process.cwd()): Company[] {
  if (_cache) return _cache

  const reviews = getAllReviews(baseDir)
  const companyData = loadCompanyData(baseDir)
  const seen = new Set<string>()
  const companies: Company[] = []

  for (const review of reviews) {
    const parsed = parseCompaniesFromContent(review.content, {
      title: review.title,
      slug: review.slug,
      category: review.category,
    })

    for (const company of parsed) {
      if (!seen.has(company.slug)) {
        seen.add(company.slug)
        const override = companyData[company.slug]
        companies.push({
          ...company,
          // Merge: description-extracted highlights prepended, auto-generated appended
          highlights: [
            ...(override?.highlights ?? []),
            ...company.highlights,
          ],
          // Prefer extracted services over keyword-matched fallback
          services: override?.services?.length ? override.services : company.services,
        })
      }
    }
  }

  _cache = companies
  return companies
}

export function getCompany(slug: string, baseDir = process.cwd()): Company | undefined {
  return getAllCompanies(baseDir).find(c => c.slug === slug)
}

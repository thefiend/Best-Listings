/**
 * @jest-environment node
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { getAllCompanies, getCompaniesInArticle } from '@/lib/companies'

function makeFixture(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'companies-'))
  const reviewsDir = path.join(dir, 'content', 'reviews', 'lifestyle')
  fs.mkdirSync(reviewsDir, { recursive: true })
  fs.writeFileSync(path.join(reviewsDir, 'best-test-food.mdx'), `---
title: "10 Best Test Food in Singapore (2026)"
category: lifestyle
slug: best-test-food-singapore
excerpt: "Test"
rating: 9
featured: false
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
---

<a id="business-1"></a>
### 1. Alpha Stall, Best Overall

Alpha Stall serves great food.

📍 **Address:** 51 Old Airport Rd, #01-34, Singapore 390051\\
📞 **Phone:** +65 8808 0645\\
⭐ **Rating:** 4.9 (1,069 Google reviews)

<a id="business-2"></a>
### 2. Beta Kitchen, Best Value

Beta Kitchen is cheap.

📍 **Address:** 10 Ubi Crescent\\
<CompanyRating name="Beta Kitchen" rating={4.5} reviewCount={120} address="10 Ubi Crescent" postalCode="408564" phone="+65 6000 0000" />

<a id="business-3"></a>
### 3. Gamma Cafe, Best Coffee

Gamma has no rating line.

📍 **Address:** 1 Somewhere, Singapore 123456
`)
  return dir
}

describe('companies', () => {
  const baseDir = makeFixture()

  it('parses companies from plain rating lines and CompanyRating props', () => {
    const all = getAllCompanies(baseDir)
    expect(all.map(c => c.slug)).toEqual(['alpha-stall', 'beta-kitchen'])

    const alpha = all[0]
    expect(alpha.rating).toBe(4.9)
    expect(alpha.reviewCount).toBe(1069)
    expect(alpha.address).toBe('51 Old Airport Rd, #01-34')
    expect(alpha.postalCode).toBe('390051')
    expect(alpha.phone).toBe('+65 8808 0645')

    const beta = all[1]
    expect(beta.rating).toBe(4.5)
    expect(beta.reviewCount).toBe(120)
    expect(beta.postalCode).toBe('408564')
  })

  it('resolves the companies ranked in an article in rank order', () => {
    const content = fs.readFileSync(
      path.join(baseDir, 'content', 'reviews', 'lifestyle', 'best-test-food.mdx'),
      'utf8'
    )
    const inArticle = getCompaniesInArticle(content, baseDir)
    expect(inArticle.map(c => [c.rank, c.slug])).toEqual([[1, 'alpha-stall'], [2, 'beta-kitchen']])
  })
})

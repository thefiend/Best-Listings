import { chromium } from '@playwright/test'
import { mkdirSync } from 'fs'

mkdirSync('./screenshots', { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await context.newPage()

// /deals index — desktop
await page.goto('http://localhost:3001/deals', { waitUntil: 'networkidle' })
await page.screenshot({ path: './screenshots/deals-index-desktop.png', fullPage: true })
console.log('✓ deals-index-desktop')

// /deals index — mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
const mobilePage = await mobile.newPage()
await mobilePage.goto('http://localhost:3001/deals', { waitUntil: 'networkidle' })
await mobilePage.screenshot({ path: './screenshots/deals-index-mobile.png', fullPage: true })
console.log('✓ deals-index-mobile')
await mobile.close()

// Tiger Brokers article — desktop
await page.goto('http://localhost:3001/deals/tiger-brokers-promo-codes-singapore', { waitUntil: 'networkidle' })
await page.screenshot({ path: './screenshots/tiger-brokers-article-desktop.png', fullPage: true })
console.log('✓ tiger-brokers-article-desktop')

// Tiger Brokers article — above fold only
await page.screenshot({ path: './screenshots/tiger-brokers-article-above-fold.png', fullPage: false })
console.log('✓ tiger-brokers-article-above-fold')

await browser.close()
console.log('Done.')

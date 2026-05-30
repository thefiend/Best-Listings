import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.bestthingreview.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*',                 allow: '/' },
      { userAgent: 'GPTBot',            allow: '/' },
      { userAgent: 'Google-Extended',   allow: '/' },
      { userAgent: 'PerplexityBot',     allow: '/' },
      { userAgent: 'anthropic-ai',      allow: '/' },
      { userAgent: 'Claude-Web',        allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

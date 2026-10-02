import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.bestthingreview.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*',                 allow: '/' },
      { userAgent: 'GPTBot',            allow: '/' },
      { userAgent: 'OAI-SearchBot',     allow: '/' },
      { userAgent: 'ChatGPT-User',      allow: '/' },
      { userAgent: 'Google-Extended',   allow: '/' },
      { userAgent: 'PerplexityBot',     allow: '/' },
      { userAgent: 'Perplexity-User',   allow: '/' },
      { userAgent: 'ClaudeBot',         allow: '/' },
      { userAgent: 'Claude-SearchBot',  allow: '/' },
      { userAgent: 'Claude-User',       allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
      { userAgent: 'Amazonbot',         allow: '/' },
      { userAgent: 'DuckAssistBot',     allow: '/' },
      { userAgent: 'MistralAI-User',    allow: '/' },
      { userAgent: 'anthropic-ai',      allow: '/' },
      { userAgent: 'Claude-Web',        allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'cohere-ai',         allow: '/' },
      { userAgent: 'Bytespider',        allow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

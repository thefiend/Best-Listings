// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bestthingreview.com'),
  title: {
    default: 'BestThingReview — Trusted Reviews & Buying Guides',
    template: '%s | BestThingReview',
  },
  description:
    'Expert reviews, in-depth comparisons, and buying guides across tech, home, software, lifestyle, and travel.',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/favicon/apple-touch-icon.png' },
    other: [
      { rel: 'android-chrome-192x192', url: '/favicon/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/favicon/android-chrome-512x512.png' },
    ],
  },
}

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.bestthingreview.com/#organization',
      name: 'BestThingReview',
      url: 'https://www.bestthingreview.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bestthingreview.com/favicon/android-chrome-512x512.png',
        width: 512,
        height: 512,
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.bestthingreview.com/#website',
      url: 'https://www.bestthingreview.com',
      name: 'BestThingReview',
      publisher: { '@id': 'https://www.bestthingreview.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.bestthingreview.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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

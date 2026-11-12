import type { Metadata, Viewport } from 'next'
import { Anton, Archivo, Caveat, Permanent_Marker } from 'next/font/google'
import { siteUrl } from '@/lib/site-url'
import { copy } from '@/content/copy'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/zine.css'
import '@/styles/layout.css'
import '@/styles/pages.css'

/* Self-hosted at build time — no external request, no flash of fallback type. */
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})
const caveat = Caveat({
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})
const marker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marker-src',
  display: 'swap',
})

const meta = copy('shared').meta

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: meta.title,
    template: '%s — DOKADS',
  },
  description: meta.description,
  openGraph: {
    type: 'website',
    siteName: 'DOKADS',
    title: meta.shareTitle,
    description: meta.shareDescription,
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#F6F1E6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${caveat.variable} ${marker.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}

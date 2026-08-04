import type { Metadata, Viewport } from 'next'
import { Anton, Archivo, Caveat, Permanent_Marker } from 'next/font/google'
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

const SITE = 'https://dokads.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'DOKADS — For the next generation of Korean adoption stories',
    template: '%s — DOKADS',
  },
  description:
    'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees.',
  openGraph: {
    type: 'website',
    siteName: 'DOKADS',
    title: 'DOKADS / Issue 001',
    description:
      'Was your parent or grandparent adopted from Korea? A community for descendants of Korean adoptees.',
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

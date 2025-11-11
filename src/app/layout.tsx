

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Healthcare E-commerce',
    template: '%s | Healthcare E-commerce',
  },
  description: 'Shop professional healthcare and wellness products with ease.',
  keywords: [
    'healthcare',
    'medical supplies',
    'wellness',
    'pharmacy',
    'e-commerce',
    'buy medicine online',
  ],
  authors: [{ name: 'Healthcare E-commerce Team' }],
  metadataBase: new URL('https://healthexcellence.shop/'), // replace with your real domain
  openGraph: {
    title: 'Healthcare E-commerce',
    description: 'Your trusted healthcare products marketplace',
    url: 'https://healthexcellence.shop/',
    siteName: 'Healthcare E-commerce',
    images: [
      {
        url: '/og-image.png', // create a social preview image later
        width: 1200,
        height: 630,
        alt: 'Healthcare E-commerce',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare E-commerce',
    description: 'Shop professional healthcare products and wellness essentials.',
    images: ['/og-image.png'],
    creator: '@yourhandle',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

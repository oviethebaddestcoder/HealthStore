import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

// Environment variables
const {
  NEXT_PUBLIC_SITE_URL = 'https://healthexcellence.shop',
  NEXT_PUBLIC_SITE_NAME = 'HealthExcellence',
  NEXT_PUBLIC_DEFAULT_TITLE = 'HealthExcellence - Premium Health & Wellness Products in Nigeria',
  NEXT_PUBLIC_DEFAULT_DESCRIPTION = 'Shop premium health supplements, vitamins, and wellness products at HealthExcellence. Fast delivery across Nigeria. Quality guaranteed. Your trusted health partner since 2024.',
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'G-T5L5QCCG02',
  NEXT_PUBLIC_GOOGLE_VERIFICATION = '',
  NEXT_PUBLIC_BING_VERIFICATION = '',
  NEXT_PUBLIC_YANDEX_VERIFICATION = '',
  NEXT_PUBLIC_TWITTER_HANDLE = '@healthexcellence',
  NEXT_PUBLIC_BUSINESS_PHONE = '+234-XXX-XXX-XXXX',
  NEXT_PUBLIC_BUSINESS_EMAIL = 'info@healthexcellence.shop',
  NEXT_PUBLIC_BUSINESS_LATITUDE = '6.5244',
  NEXT_PUBLIC_BUSINESS_LONGITUDE = '3.3792',
} = process.env

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_SITE_URL),
  
  title: {
    default: NEXT_PUBLIC_DEFAULT_TITLE,
    template: `%s | ${NEXT_PUBLIC_SITE_NAME}`,
  },
  
  description: NEXT_PUBLIC_DEFAULT_DESCRIPTION,
  
  keywords: [
    'health supplements Nigeria',
    'vitamins online Nigeria',
    'wellness products Lagos',
    'buy supplements Nigeria',
    'authentic health products',
    'pharmacy Nigeria',
    'health store Lagos',
    'multivitamins Nigeria',
    'protein supplements',
    'herbal products Nigeria',
    'medical supplies',
    'healthcare products',
    'fitness supplements',
    'organic health products',
    'immune boosters Nigeria',
  ],
  
  authors: [{ name: NEXT_PUBLIC_SITE_NAME, url: NEXT_PUBLIC_SITE_URL }],
  creator: NEXT_PUBLIC_SITE_NAME,
  publisher: NEXT_PUBLIC_SITE_NAME,
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Favicon Configuration
  icons: {
    icon: [
      { url: '/favicon.io', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  
  manifest: '/site.webmanifest',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: NEXT_PUBLIC_SITE_URL,
    siteName: NEXT_PUBLIC_SITE_NAME,
    title: NEXT_PUBLIC_DEFAULT_TITLE,
    description: NEXT_PUBLIC_DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${NEXT_PUBLIC_SITE_NAME} - Your Trusted Health Partner`,
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: NEXT_PUBLIC_DEFAULT_TITLE,
    description: NEXT_PUBLIC_DEFAULT_DESCRIPTION,
    images: ['/og-image.jpg'],
    creator: NEXT_PUBLIC_TWITTER_HANDLE,
  },
  
  // Verification
  verification: {
    ...(NEXT_PUBLIC_GOOGLE_VERIFICATION && { google: NEXT_PUBLIC_GOOGLE_VERIFICATION }),
   
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Additional Meta
  category: 'health',
  
  // Alternate Languages
  alternates: {
    canonical: NEXT_PUBLIC_SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
        
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              "name": NEXT_PUBLIC_SITE_NAME,
              "alternateName": `${NEXT_PUBLIC_SITE_NAME} Nigeria`,
              "url": NEXT_PUBLIC_SITE_URL,
              "logo": `${NEXT_PUBLIC_SITE_URL}/logo.png`,
              "image": `${NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
              "description": NEXT_PUBLIC_DEFAULT_DESCRIPTION,
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NG",
                "addressLocality": "Lagos",
                "addressRegion": "Lagos State"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": NEXT_PUBLIC_BUSINESS_LATITUDE,
                "longitude": NEXT_PUBLIC_BUSINESS_LONGITUDE
              },
              ...(NEXT_PUBLIC_BUSINESS_PHONE && { telephone: NEXT_PUBLIC_BUSINESS_PHONE }),
              ...(NEXT_PUBLIC_BUSINESS_EMAIL && { email: NEXT_PUBLIC_BUSINESS_EMAIL }),
              "priceRange": "₦₦",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              },
              "sameAs": [
                `https://facebook.com/${NEXT_PUBLIC_SITE_NAME.toLowerCase()}`,
                `https://twitter.com/${NEXT_PUBLIC_TWITTER_HANDLE.replace('@', '')}`,
                `https://instagram.com/${NEXT_PUBLIC_SITE_NAME.toLowerCase()}`
              ]
            })
          }}
        />
        
        {/* Website Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": NEXT_PUBLIC_SITE_NAME,
              "url": NEXT_PUBLIC_SITE_URL,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${NEXT_PUBLIC_SITE_URL}/products?search={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
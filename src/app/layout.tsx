import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Voxtrav - Immersive Audio Tours & Travel Guides',
    template: '%s | Voxtrav'
  },
  description: 'Discover the world through immersive audio tours. Explore cities, landmarks, and hidden gems with professional voice-guided experiences. Your personal travel companion for authentic local stories.',
  keywords: [
    'audio tours',
    'travel guides',
    'voice tours',
    'travel app',
    'city exploration',
    'landmark tours',
    'local stories',
    'travel companion',
    'immersive travel',
    'guided tours'
  ],
  authors: [{ name: 'Voxtrav Team' }],
  creator: 'Voxtrav',
  publisher: 'Voxtrav',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://voxtrav.info'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://voxtrav.info',
    title: 'Voxtrav - Immersive Audio Tours & Travel Guides',
    description: 'Discover the world through immersive audio tours. Explore cities, landmarks, and hidden gems with professional voice-guided experiences.',
    siteName: 'Voxtrav',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voxtrav - Audio Tours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voxtrav - Immersive Audio Tours & Travel Guides',
    description: 'Discover the world through immersive audio tours. Your personal travel companion.',
    images: ['/og-image.jpg'],
  },
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
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 
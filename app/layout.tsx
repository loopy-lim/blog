import './globals.css'
import { siteConfig } from '@/site.config'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'
import { Navbar } from '@/components/layout/Navbar'
import TopLoader from '@/components/layout/TopLoader'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

export const metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/og/default.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/images/og/default.jpg'],
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': '/feed.xml',
    },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <WebsiteJsonLd
          name={siteConfig.title}
          description={siteConfig.description}
          url={siteConfig.url}
          author={siteConfig.author}
        />
      </head>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
        />
        <TopLoader />
        <div className="flex min-h-screen flex-col antialiased">
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

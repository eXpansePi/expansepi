import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import Script from "next/script"
import "@fontsource-variable/manrope"
import "@fontsource/ibm-plex-mono/latin-400.css"
import "@fontsource/ibm-plex-mono/latin-ext-400.css"
import "@fontsource/ibm-plex-mono/cyrillic-400.css"
import "./globals.css"
import LangSetter from "./LangSetter"
import { AnalyticsTracker } from "./components/AnalyticsTracker"
import { ConsentedAnalytics } from "./components/ConsentedAnalytics"

export const metadata: Metadata = {
  title: {
    default: "eXpansePi - IT Education",
    template: "%s | eXpansePi"
  },
  description: "IT education platform for everyone",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml', sizes: '180x180' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

  return (
    <html lang="cs" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <LangSetter />

        {/*
          Declares the gtag queue and denies every storage purpose before any
          tag can run. It issues no request and writes no cookie, so it is safe
          pre-consent; ConsentedAnalytics loads the actual tags once consent is
          granted and lib/consent flips these purposes to granted.
        */}
        <Script
          id="gtag-consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />

        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
        <ConsentedAnalytics googleAdsId={googleAdsId} />
      </body>
    </html>
  )
}

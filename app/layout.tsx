import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import LangSetter from "./LangSetter"
import AnimationManager from "./AnimationManager"
import { AnalyticsTracker } from "./components/AnalyticsTracker"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

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
    <html lang="cs" suppressHydrationWarning style={{ background: '#ffffff' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#ffffff' }}
      >
        <LangSetter />
        <AnimationManager />

        {googleAdsId ? (
          <>
            {/* 1. Consent Mode defaults (must run before gtag.js loads) */}
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

            {/* 2. Load gtag.js library (lazyOnload: non-critical for initial paint) */}
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            />

            {/* 3. Configure gtag after library is available */}
            <Script
              id="gtag-config"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAdsId}', { send_page_view: false });
                `,
              }}
            />
          </>
        ) : null}

        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

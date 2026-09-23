"use client"

import { useSyncExternalStore } from "react"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { getServerConsentSnapshot, readConsent, subscribeToConsent } from "@/lib/consent"

/**
 * Loads every non-essential tag, and only after consent is granted.
 *
 * Consent Mode defaults are declared separately in the document so the gtag
 * queue exists from the first paint; nothing here runs until the visitor opts
 * in, so no request reaches Google or Vercel before that point.
 */
export function ConsentedAnalytics({ googleAdsId }: { googleAdsId?: string }) {
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, getServerConsentSnapshot)
  if (consent !== "granted") return null

  return (
    <>
      {googleAdsId ? (
        <>
          <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`} />
          <Script
            id="gtag-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `gtag('js', new Date());gtag('config', ${JSON.stringify(googleAdsId)}, { send_page_view: false });`,
            }}
          />
        </>
      ) : null}
      {process.env.NODE_ENV === "production" && <Analytics />}
    </>
  )
}

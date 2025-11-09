import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import LangSetter from "./LangSetter"
import AnimationManager from "./AnimationManager"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "eXpansePi - IT Education",
    template: "%s | eXpansePi"
  },
  description: "IT education platform for everyone",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"),
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LangSetter />
        <AnimationManager />
        {children}
      </body>
    </html>
  )
}

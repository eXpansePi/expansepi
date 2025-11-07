import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "eXpansePi - Rekvalifikační IT kurzy | Python, Datová analýza, Web Development",
    template: "%s | eXpansePi"
  },
  description: "Rekvalifikační IT kurzy s experty z Matfyzu UK a ČVUT. Naučte se Python, datovou analýzu, web development a další IT dovednosti. Budujeme novou generaci softwarových inženýrů.",
  keywords: [
    "rekvalifikační kurzy IT",
    "IT kurzy Praha",
    "programování kurzy",
    "Python kurzy",
    "datová analýza kurzy",
    "web development kurzy",
    "Matfyz UK",
    "ČVUT",
    "softwarové inženýrství",
    "IT vzdělávání",
    "rekvalifikace IT",
    "IT kurzy pro začátečníky",
    "rekvalifikační kurzy Praha",
    "IT rekvalifikace"
  ],
  authors: [{ name: "eXpansePi" }],
  creator: "eXpansePi",
  publisher: "eXpansePi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.cz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "/",
    siteName: "eXpansePi",
    title: "eXpansePi - Rekvalifikační IT kurzy",
    description: "Rekvalifikační IT kurzy s experty z Matfyzu UK a ČVUT. Naučte se Python, datovou analýzu, web development.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

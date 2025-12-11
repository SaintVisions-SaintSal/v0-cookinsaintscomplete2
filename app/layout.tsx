import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#D4AF37" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0F0F" },
  ],
}

export const metadata: Metadata = {
  title: "CookinSaints - Where Hustlers Build Wealth",
  description:
    "Unified investment platform combining traditional securities, cryptocurrency, and tokenized real estate. Powered by SaintSal™ AI and HACP™ technology.",
  keywords: [
    "investing",
    "crypto",
    "stocks",
    "real estate",
    "tokenization",
    "fintech",
    "wealth building",
    "SaintSal",
    "CSREC",
  ],
  authors: [{ name: "CookinSaints" }],
  creator: "CookinSaints",
  publisher: "CookinSaints",
  applicationName: "CookinSaints",
  generator: "v0.app",
  metadataBase: new URL("https://cookinsaints.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cookinsaints.com",
    title: "CookinSaints - Where Hustlers Build Wealth",
    description:
      "Unified investment platform combining traditional securities, cryptocurrency, and tokenized real estate.",
    siteName: "CookinSaints",
    images: [
      {
        url: "/saintsal-icon.png",
        width: 1024,
        height: 1024,
        alt: "SaintSal™ Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CookinSaints - Where Hustlers Build Wealth",
    description:
      "Unified investment platform combining traditional securities, cryptocurrency, and tokenized real estate.",
    images: ["/saintsal-icon.png"],
  },
  icons: {
    icon: [
      {
        url: "/saintsal-icon.png",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/saintsal-icon.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
    shortcut: "/saintsal-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CookinSaints",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

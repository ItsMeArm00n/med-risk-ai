import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "MedRisk AI - Advanced Health Risk Assessment Platform",
  description:
    "Professional AI-powered health risk assessment platform. Analyze patient vital signs with advanced machine learning for accurate risk prediction.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="RDUGD8HMA4Bpe0-FbavMheK8M6JSVCYDE8e5mR1C3yQ" />
      </head>
      <body className={`font-sans ${geistSans.variable} ${manrope.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
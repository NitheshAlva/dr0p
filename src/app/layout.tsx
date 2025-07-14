import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar"
import { Analytics } from "@vercel/analytics/react"
import SEO from "@/components/SEO"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: "dr0p.live | Instant Sharing, Zero Hassle",
  description: "Share notes and files instantly between devices — no signups, no fuss.",
  keywords: ["file sharing", "note sharing", "temporary notes",'no sign-up', "secure sharing", "instant sharing",'cl1p','filebin'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <SEO/>
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster richColors expand={true}/>
        <Analytics/>
      </body>
    </html>
  )
}


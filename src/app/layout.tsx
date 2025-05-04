import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/Navbar"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster richColors expand={true}/>
          <Analytics/>
        </ThemeProvider>
      </body>
    </html>
  )
}


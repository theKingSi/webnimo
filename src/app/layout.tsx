import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Webnime - Your Ultimate Anime Universe",
  description:
    "🌟 Discover, explore, and dive into thousands of anime series with lightning-fast search, real-time suggestions, and stunning visuals! ✨",
  keywords: [
    "anime",
    "manga",
    "webnime",
    "anime search",
    "anime discovery",
    "MyAnimeList",
    "AniList",
    "Kitsu",
    "anime streaming",
  ],
  authors: [{ name: "Webnime Team" }],
  creator: "Webnime",
  publisher: "Webnime",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Webnime - Your Ultimate Anime Universe",
    description: "🌟 Discover thousands of anime with real-time search and stunning visuals! ✨",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webnime - Your Ultimate Anime Universe",
    description: "🌟 Discover thousands of anime with real-time search and stunning visuals! ✨",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " antialiased"}>
        <main className="min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}

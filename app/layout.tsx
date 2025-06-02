import type React from "react"
import type { Metadata } from "next"
import { Oswald } from "next/font/google"
import "./globals.css"

const oswald = Oswald({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The At-Bat Challenge",
  description: "Predict baseball at-bat outcomes and win prizes!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={oswald.className}>{children}</body>
    </html>
  )
}

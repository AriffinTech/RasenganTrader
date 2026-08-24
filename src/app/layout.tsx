import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RasenganTrader — Candlestick Is The Best Indicator',
  description: 'Kuasai Price Action dan True Smart Money Concept bersama Dr. Hanis Hanafi.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// Self-hosted at build time, so CSP `font-src 'self'` is satisfied.
const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-sora',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-sans',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

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
    <html
      lang="ms"
      suppressHydrationWarning
      className={`${sora.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

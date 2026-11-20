import Image from 'next/image'
import { ArrowDown } from 'lucide-react'

import { EnrollmentLink } from '@/components/enrollment-link'

// [open, close, high, low] on a 0–100 scale (lower = higher price). Static, decorative.
const candles: [number, number, number, number][] = [
  [62, 56, 50, 66], [56, 60, 52, 64], [60, 50, 46, 63], [50, 54, 47, 58],
  [54, 44, 40, 57], [44, 48, 41, 52], [48, 38, 33, 50], [38, 42, 35, 47],
  [42, 58, 39, 62], [58, 64, 55, 70], [64, 52, 49, 67], [52, 46, 43, 55],
  [46, 34, 30, 49], [34, 38, 31, 42], [38, 28, 24, 40], [28, 32, 25, 36],
  [32, 22, 18, 34], [22, 26, 19, 30], [26, 18, 14, 28], [18, 22, 15, 25],
]

function CandleBackdrop() {
  const step = 60
  const width = candles.length * step
  return (
    <svg
      className="hero-backdrop h-full w-full"
      viewBox={`0 0 ${width} 100`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* liquidity levels */}
      <line x1="0" x2={width} y1="24" y2="24" stroke="currentColor" strokeWidth="0.35" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
      <line x1="0" x2={width} y1="67" y2="67" stroke="currentColor" strokeWidth="0.35" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
      {candles.map(([open, close, high, low], i) => {
        const x = i * step + step / 2
        const top = Math.min(open, close)
        const body = Math.max(Math.abs(open - close), 1)
        const bullish = close < open
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={high} y2={low} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <rect
              x={x - 12}
              y={top}
              width="24"
              height={body}
              fill={bullish ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )
      })}
    </svg>
  )
}

export function HeroSection() {
  return (
    <section data-hero className="relative isolate overflow-hidden bg-background">
      <CandleBackdrop />
      <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] max-w-[78rem] flex-col items-center justify-center px-5 pb-16 pt-[calc(var(--header-h)+2.5rem)] text-center sm:px-8 sm:pb-24 lg:pb-28">
        <p className="rise-in inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[0.68rem] font-medium tracking-[0.18em] text-primary sm:text-xs">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          LIQUIDITY IS KING
        </p>
        <Image
          src="/logo.png"
          alt="RasenganTrader Logo"
          width={740}
          height={500}
          className="mt-7 h-auto w-32 sm:w-44 lg:w-52"
          priority
        />

        <h1 className="mt-7 max-w-[11ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,12vw,7.25rem)] font-semibold leading-[0.96] tracking-[-0.065em] text-foreground sm:mt-8 sm:max-w-[13ch] sm:text-[clamp(3.25rem,8vw,7.25rem)] sm:leading-[0.93] sm:tracking-[-0.075em]">
          Candlestick Is The <span className="text-primary">Best</span> Indicator.
        </h1>
        <p className="mt-5 max-w-[33ch] text-[0.94rem] leading-6 text-[color:var(--color-ink-soft)] sm:mt-7 sm:max-w-xl sm:text-lg sm:leading-8">
          Pembelajaran Teknik True Smart Money Concept (SMC) untuk trader yang mahu membaca pergerakan harga dengan lebih jelas dan menguasai Price Action.
        </p>
        <div className="rise-in-delay mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <EnrollmentLink offer="fast-track" className="px-6 text-sm font-semibold sm:px-7">
            Daftar Sekarang
          </EnrollmentLink>
          <a
            href="#peta-pembelajaran"
            className="enroll-outline px-6 text-sm font-medium"
          >
            Lihat laluan pembelajaran
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

const proofItems = [
  ['5 tahun', 'Pengalaman saham & futures'],
  ['±300', 'Pelajar telah dibimbing'],
  ['MR berlesen', 'Mplus · Moomoo · Phillip Capital'],
]

export function CredibilityStrip() {
  return (
    <section aria-label="Kredibiliti RasenganTrader" className="border-y border-border bg-card">
      <dl className="mx-auto grid max-w-[90rem] grid-cols-1 divide-y divide-border px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-12">
        {proofItems.map(([value, label]) => (
          <div key={value} className="flex flex-col items-center justify-center px-6 py-8 text-center sm:py-10">
            <dt className="order-last mt-2 font-mono text-[0.7rem] uppercase leading-5 tracking-[0.08em] text-muted-foreground sm:text-xs">
              {label}
            </dt>
            <dd className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

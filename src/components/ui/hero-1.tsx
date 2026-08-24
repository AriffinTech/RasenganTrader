import Image from 'next/image'
import { ArrowDown } from 'lucide-react'

import { EnrollmentLink } from '@/components/enrollment-link'

export function HeroSection() {
  return (
    <section className="site-grid relative isolate overflow-hidden border-b border-border">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px rule-fade" />
      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-[78rem] flex-col items-center justify-center px-5 pb-20 pt-16 text-center sm:px-8 lg:pb-28 lg:pt-20">
        <p className="absolute left-5 top-7 font-mono text-xs font-medium tracking-[0.18em] text-primary sm:left-8 lg:left-12">
          LIQUIDITY IS KING
        </p>
        <Image
          src="/logo.png"
          alt="RasenganTrader RT monogram"
          width={740}
          height={500}
          priority
          className="mt-7 h-auto w-[10.5rem] sm:w-[12.5rem]"
        />
        <h1 className="mt-8 max-w-[13ch] font-[family-name:var(--font-display)] text-[clamp(3.25rem,8vw,7.25rem)] font-semibold leading-[0.93] tracking-[-0.075em] text-foreground">
          Candlestick Is The <span className="text-primary">Best</span> Indicator.
        </h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-[color:var(--color-ink-soft)] sm:text-lg sm:leading-8">
          Kuasai Price Action dan baca pergerakan harga dengan lebih tenang bersama Dr. Hanis Hanafi.
        </p>
        <div className="mt-9 flex w-full max-w-xl flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <EnrollmentLink className="px-6 text-sm font-semibold sm:px-7">
            Daftar Sekarang
          </EnrollmentLink>
          <a
            href="#peta-pembelajaran"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[color:var(--color-ink-soft)] transition-colors duration-200 hover:text-primary"
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
  ['5 tahun', 'pengalaman saham & futures'],
  ['±300', 'pelajar telah dibimbing'],
  ['MR berlesen', 'Mplus · Moomoo · Phillip Capital'],
]

export function CredibilityStrip() {
  return (
    <section aria-label="Kredibiliti RasenganTrader" className="border-b border-border">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 divide-y divide-border px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-12">
        {proofItems.map(([value, label]) => (
          <div key={value} className="px-0 py-6 md:px-7 lg:px-10">
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[-0.05em] text-foreground">
              {value}
            </p>
            <p className="mt-1 font-mono text-[0.66rem] leading-5 tracking-[0.06em] text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

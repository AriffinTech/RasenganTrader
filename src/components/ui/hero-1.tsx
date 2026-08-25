import Image from 'next/image'
import { ArrowDown } from 'lucide-react'

import { EnrollmentLink } from '@/components/enrollment-link'

export function HeroSection() {
  return (
    <section className="site-grid relative isolate overflow-hidden border-b border-border">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px rule-fade" />
      <div className="relative mx-auto flex min-h-[calc(100svh-6.25rem)] max-w-[78rem] flex-col items-center justify-center px-5 pb-12 pt-12 text-center sm:px-8 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-20">
        <p className="absolute left-5 top-5 font-mono text-[0.65rem] font-medium tracking-[0.18em] text-primary sm:left-8 sm:top-7 sm:text-xs lg:left-12">
          LIQUIDITY IS KING
        </p>
        <Image
          src="/logo.png"
          alt="RasenganTrader Logo"
          width={740}
          height={500}
          className="mt-6 h-auto w-32 sm:mt-7 sm:w-48 lg:w-56"
          priority
        />

        <h1 className="mt-7 max-w-[11ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,12vw,7.25rem)] font-semibold leading-[0.96] tracking-[-0.065em] text-foreground sm:mt-8 sm:max-w-[13ch] sm:text-[clamp(3.25rem,8vw,7.25rem)] sm:leading-[0.93] sm:tracking-[-0.075em]">
          Candlestick Is The <span className="text-primary">Best</span> Indicator.
        </h1>
        <p className="mt-5 max-w-[33ch] text-[0.94rem] leading-6 text-[color:var(--color-ink-soft)] sm:mt-7 sm:max-w-xl sm:text-lg sm:leading-8">
          Pembelajaran Teknik True SMC Concept untuk trader yang mahu membaca pergerakan harga dengan lebih jelas dan menguasai Price Action.
        </p>
        <div className="mt-7 flex w-full max-w-xl flex-col items-center gap-5 sm:mt-9 sm:flex-row sm:justify-between">
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

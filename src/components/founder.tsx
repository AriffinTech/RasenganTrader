import Image from 'next/image'

import founderPortrait from '../../photo_2026-08-25_00-38-51.jpg'

export function Founder() {
  return (
    <section id="background-educator" className="scroll-mt-32 border-y border-border px-5 py-16 sm:px-8 sm:py-20 md:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-center lg:gap-16">
        <figure className="relative overflow-hidden border border-border bg-secondary">
          <Image
            src={founderPortrait}
            alt="Dr Hanis Hanafi, founder RasenganTrader"
            className="aspect-[4/5] h-full w-full object-cover object-center"
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 58vw, 100vw"
          />
          <figcaption className="absolute inset-x-0 bottom-0 border-t border-white/20 bg-background/80 px-5 py-4 backdrop-blur-sm">
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[-0.04em] text-foreground">Dr Hanis Hanafi</p>
            <p className="mt-1 font-mono text-[0.66rem] tracking-[0.08em] text-primary">FOUNDER OF RASENGANTRADER</p>
          </figcaption>
        </figure>

        <div>
          <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">BACKGROUND</p>
          <blockquote className="mt-5 max-w-[15ch] text-[clamp(2rem,4vw,4.35rem)] font-semibold leading-[1.04] tracking-[-0.06em] text-foreground">
            &ldquo;Harga sentiasa mendahului apa-apa indicator.&rdquo;
          </blockquote>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--color-ink-soft)]">
            Founder of RasenganTrader dan Trading Educator yang memberi fokus kepada pembacaan Price Action dan pergerakan harga sebenar.
          </p>

          <dl className="mt-10 grid gap-x-10 gap-y-7 border-t border-border pt-7 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[0.66rem] tracking-[0.08em] text-muted-foreground">PENGALAMAN</dt>
              <dd className="mt-2 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                5 years of experience in Stocks &amp; Futures Trading, mentoring almost 300 students.
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.66rem] tracking-[0.08em] text-muted-foreground">LESEN MR</dt>
              <dd className="mt-2 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                Licensed Marketing Representative (MR) with Mplus, Moomoo &amp; Phillip Capital.
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-mono text-[0.66rem] tracking-[0.08em] text-muted-foreground">KELAYAKAN</dt>
              <dd className="mt-2 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                Certified Technical Analyst with Distinction.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/ui/header-1'
import { RegistrationForm } from '@/components/registration-form'
import { courseOffer } from '@/lib/course'
import { enrollment } from '@/lib/site-config'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="grow px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[80rem]">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Kembali ke RasenganTrader
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:items-start">
            <div>
              <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">18 & 19 JULY 2026 · GOOGLE MEET</p>
              <h1 className="mt-5 max-w-[10ch] text-[clamp(3rem,6vw,6.5rem)] font-semibold leading-[0.93] tracking-[-0.075em] text-foreground">
                {courseOffer.title}
              </h1>
              <p className="mt-7 max-w-[58ch] text-lg leading-8 text-[color:var(--color-ink-soft)]">
                Dua hari pembelajaran True Smart Money Concept bersama {courseOffer.educator}. Kelas berlangsung {courseOffer.schedule.join(' dan ')} melalui {courseOffer.platform}.
              </p>

              <div className="mt-12 grid gap-6 border-y border-border py-7 sm:grid-cols-2">
                {courseOffer.modules.map((module) => (
                  <div key={module.number}>
                    <p className="font-mono text-xs text-primary">{module.number}</p>
                    <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">{module.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.lessons.length} topik pembelajaran.</p>
                  </div>
                ))}
              </div>
            </div>

            <RegistrationForm checkoutUrl={enrollment.url} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

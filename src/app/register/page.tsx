import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/ui/header-1'
import { RegistrationForm } from '@/components/registration-form'
import { courseOffer, isRegistrationOffer, registrationOffers } from '@/lib/course'
import { enrollment } from '@/lib/site-config'

type RegisterPageProps = {
  searchParams: Promise<{ offer?: string | string[] }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const requestedOffer = (await searchParams).offer
  const offerValue = Array.isArray(requestedOffer) ? requestedOffer[0] : requestedOffer
  const selectedOffer = isRegistrationOffer(offerValue) ? offerValue : 'course'
  const offer = registrationOffers[selectedOffer]

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
              <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">
                {selectedOffer === 'course' ? 'NEXT CLASS · ' + courseOffer.nextClass.toUpperCase() : 'RASENGANTRADER'}
              </p>
              <h1 className="mt-5 max-w-[11ch] text-[clamp(3rem,6vw,6.5rem)] font-semibold leading-[0.93] tracking-[-0.075em] text-foreground">
                {offer.title}
              </h1>
              <p className="mt-7 max-w-[58ch] text-lg leading-8 text-[color:var(--color-ink-soft)]">
                {offer.description}
              </p>

              {selectedOffer === 'course' ? (
                <div className="mt-12 grid gap-6 border-y border-border py-7 sm:grid-cols-2">
                  {courseOffer.modules.map((module) => (
                    <div key={module.number}>
                      <p className="font-mono text-xs text-primary">{module.number}</p>
                      <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">{module.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.lessons.length} topik pembelajaran.</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <RegistrationForm checkoutUrl={enrollment.url} initialOffer={selectedOffer} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/ui/header-1'
import { RegistrationForm } from '@/components/registration-form'
import { getPublicClassSessions, getCourses } from '@/lib/db/courses'
import { courseOffer, isRegistrationOffer, personalCoachingOffer, registrationOffers, saham101Offer, tradingClinicOnlineOffer } from '@/lib/course'

type RegisterPageProps = {
  searchParams: Promise<{ offer?: string | string[] }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const [courses, sessions] = await Promise.all([
    getCourses(),
    getPublicClassSessions(),
  ])

  const requestedOffer = (await searchParams).offer
  const offerValue = Array.isArray(requestedOffer) ? requestedOffer[0] : requestedOffer
  const selectedOffer = isRegistrationOffer(offerValue) ? offerValue : 'saham-101'
  const fallbackOffer = registrationOffers[selectedOffer]

  const targetCourse = courses.find((c) => c.slug === selectedOffer)
  const targetSession = sessions.find((s) => s.course?.slug === selectedOffer)

  const isUpcoming = targetSession?.status === 'upcoming'
  const isClosed = targetSession?.status === 'closed' || targetSession?.status === 'archived'

  const offerTitle = targetCourse?.title || fallbackOffer.title
  const offerDescription = targetCourse?.description || fallbackOffer.description

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
                {isUpcoming
                  ? `OPENING SOON · ${(targetSession?.display_date || targetCourse?.title || '').toUpperCase()}`
                  : 'RASENGANTRADER'}
              </p>
              <h1 className="mt-5 max-w-[14ch] text-[clamp(3rem,6vw,6.5rem)] font-semibold leading-[0.93] tracking-[-0.075em] text-foreground">
                {offerTitle}
              </h1>
              <p className="mt-7 max-w-[58ch] text-lg leading-8 text-[color:var(--color-ink-soft)]">
                {offerDescription}
              </p>

              {selectedOffer === 'saham-101' ? (
                <div className="mt-12 grid gap-6 border-y border-border py-7 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-xs text-primary">JADUAL</p>
                    <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">
                      {targetSession?.display_date || saham101Offer.date}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {targetSession?.display_time || saham101Offer.time}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-primary">CONTENT</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                      {(targetCourse?.modules?.[0]?.lessons || saham101Offer.topics).map((topic) => (
                        <li key={topic}>• {topic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : selectedOffer === 'personal-coaching' ? (
                <div className="mt-12 border-y border-border py-7">
                  <p className="font-mono text-xs text-primary">PAKEJ COACHING</p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                    {(targetCourse?.bonuses || personalCoachingOffer.inclusions).map((inclusion) => (
                      <li key={inclusion}>- {inclusion}</li>
                    ))}
                  </ul>
                </div>
              ) : selectedOffer.startsWith('trading-clinic') ? (
                <div className="mt-12 border-y border-border py-7">
                  <p className="font-mono text-xs text-primary">SESSION INI COVER</p>
                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
                    {(targetCourse?.bonuses || tradingClinicOnlineOffer.topics).map((topic) => (
                      <li key={topic}>- {topic}</li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-6 text-muted-foreground">{tradingClinicOnlineOffer.note}</p>
                </div>
              ) : selectedOffer === 'fast-track' ? (
                <div className="mt-12 grid gap-6 border-y border-border py-7 sm:grid-cols-2">
                  {(targetCourse?.modules || courseOffer.modules).map((module) => (
                    <div key={module.number}>
                      <p className="font-mono text-xs text-primary">{module.number}</p>
                      <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">{module.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.lessons.length} topik pembelajaran.</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {isUpcoming ? (
              <div className="border border-primary bg-secondary p-7 sm:p-10">
                <p className="font-mono text-xs tracking-[0.14em] text-primary">OPENING SOON</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  Pendaftaran dibuka pada {targetSession?.display_date || 'sesi akan datang'}.
                </h2>
                <p className="mt-4 leading-7 text-[color:var(--color-ink-soft)]">
                  Sila kembali semula apabila pendaftaran dibuka.
                </p>
                <Link href="/#kelas" className="enroll-outline mt-8 inline-flex px-5 text-sm font-semibold">
                  Lihat kelas yang tersedia
                </Link>
              </div>
            ) : isClosed ? (
              <div className="border border-border bg-secondary p-7 sm:p-10">
                <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground">PENDAFTARAN DITUTUP</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  Pendaftaran untuk kelas ini telah ditutup.
                </h2>
                <p className="mt-4 leading-7 text-[color:var(--color-ink-soft)]">
                  Kouta untuk sesi ini telah penuh atau pendaftaran telah ditamatkan. Sila pilih sesi lain atau hubungi kami.
                </p>
                <Link href="/#kelas" className="enroll-outline mt-8 inline-flex px-5 text-sm font-semibold">
                  Lihat kelas yang tersedia
                </Link>
              </div>
            ) : (
              <RegistrationForm initialOffer={selectedOffer} sessions={sessions} courses={courses} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

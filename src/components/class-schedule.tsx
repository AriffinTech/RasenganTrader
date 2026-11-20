import { EnrollmentLink } from '@/components/enrollment-link'
import { getPublicClassSessions } from '@/lib/db/courses'
import type { RegistrationOfferKey } from '@/lib/course'

function formatPrice(cents: number) {
  const rm = cents / 100
  return `RM${rm.toLocaleString('en-US')}`
}

function CheckList({ title, items, columns = false }: { title: string; items: readonly string[]; columns?: boolean }) {
  return (
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <ul className={`mt-2 grid gap-1.5 ${columns ? 'sm:grid-cols-2 sm:gap-x-5' : ''}`}>
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function ClassSchedule() {
  const sessions = await getPublicClassSessions()

  if (sessions.length === 0) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
      {sessions.map((item) => {
        const offerKey = (item.course?.slug || 'fast-track') as RegistrationOfferKey
        const isUpcoming = item.status === 'upcoming'
        const isClosed = item.status === 'closed'
        const isExtended = item.status === 'completed_registering'
        const isAvailable = item.status === 'open' || isExtended

        const isCoaching = offerKey === 'personal-coaching' || offerKey.startsWith('trading-clinic')
        const isFlagship = offerKey === 'fast-track'

        const status = isUpcoming
          ? { label: 'Opening Soon', tone: 'warning' }
          : isClosed
          ? { label: 'Penuh / Closed', tone: 'closed' }
          : isExtended
          ? { label: 'Sesi Rakaman', tone: 'info' }
          : { label: 'Open', tone: 'open' }

        const categoryLabel =
          offerKey === 'personal-coaching'
            ? 'Personal Coaching'
            : offerKey.startsWith('trading-clinic')
            ? 'Trading Clinic'
            : offerKey === 'saham-101'
            ? 'Beginner Class'
            : 'True SMC Fast Track'

        const formattedPrice = formatPrice(item.price_cents)
        const availabilityText = item.custom_inclusions && item.custom_inclusions.length > 0 ? item.custom_inclusions[0] : null

        return (
          <article
            key={item.id}
            className={`surface-card flex h-full flex-col p-6 sm:p-8 ${isFlagship ? 'border-primary/60' : ''}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">{categoryLabel}</p>
              <span className={`status-badge status-badge--${status.tone}`}>{status.label}</span>
            </div>

            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-foreground">{item.session_title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.display_date}</p>

            {availabilityText ? <p className="mt-3 text-sm font-medium text-primary">{availabilityText}</p> : null}

            <div className="mt-6 space-y-5 text-sm leading-6 text-[color:var(--color-ink-soft)]">
              {offerKey === 'personal-coaching' && item.course?.bonuses ? (
                <CheckList title="Pakej" items={item.course.bonuses} />
              ) : null}

              {offerKey === 'saham-101' && item.course ? (
                <>
                  {item.course.modules?.[0] ? <CheckList title="Content" items={item.course.modules[0].lessons} columns /> : null}
                  {item.course.bonuses && item.course.bonuses.length > 0 ? (
                    <CheckList title="Bonus" items={item.course.bonuses} columns />
                  ) : null}
                  {item.course.exclusive_bonus ? (
                    <div className="surface-tint p-4">
                      <p className="font-semibold text-primary">Exclusive bonus: {item.course.exclusive_bonus.title}</p>
                      <ul className="mt-2 space-y-1">
                        {item.course.exclusive_bonus.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                      </ul>
                    </div>
                  ) : null}
                </>
              ) : null}

              {offerKey.startsWith('trading-clinic') && item.course?.bonuses ? (
                <CheckList title="Sesi ini cover" items={item.course.bonuses} columns />
              ) : null}
            </div>

            <div className="mt-auto pt-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-6">
              <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.06em] text-foreground">
                {formattedPrice}
              </p>
              {isAvailable ? (
                <EnrollmentLink offer={offerKey} variant={isCoaching ? 'outline' : 'solid'} className="px-5 text-sm font-semibold">
                  {isCoaching ? 'Mohon Coaching' : isExtended ? 'Daftar Sesi Rakaman' : 'Daftar Kelas'}
                </EnrollmentLink>
              ) : (
                <span aria-disabled="true" className="enroll-disabled px-5 text-sm font-semibold">
                  {isUpcoming ? 'Opening Soon' : 'Penuh (Closed)'}
                </span>
              )}
            </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

import { EnrollmentLink } from '@/components/enrollment-link'
import { getPublicClassSessions } from '@/lib/db/courses'
import type { RegistrationOfferKey } from '@/lib/course'

function formatPrice(cents: number) {
  const rm = cents / 100
  return `RM${rm.toLocaleString('en-US')}`
}

export default async function ClassSchedule() {
  const sessions = await getPublicClassSessions()

  if (sessions.length === 0) return null

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sessions.map((item) => {
        const offerKey = (item.course?.slug || 'fast-track') as RegistrationOfferKey
        const isUpcoming = item.status === 'upcoming'
        const isClosed = item.status === 'closed'
        const isExtended = item.status === 'completed_registering'
        const isAvailable = item.status === 'open' || isExtended

        const isCoaching = offerKey === 'personal-coaching' || offerKey.startsWith('trading-clinic')
        const borderClass = isCoaching ? 'border-primary' : 'border-border'

        const statusLabel = isUpcoming
          ? 'Opening Soon'
          : isClosed
          ? 'Penuh / Closed'
          : isExtended
          ? 'Sesi Rakaman (Terbuka)'
          : 'Open'

        const badgeColor = isAvailable
          ? 'bg-primary/10 text-primary'
          : 'bg-destructive/10 text-destructive'

        const categoryLabel =
          offerKey === 'personal-coaching'
            ? 'PERSONAL COACHING'
            : offerKey.startsWith('trading-clinic')
            ? 'TRADING CLINIC'
            : offerKey === 'saham-101'
            ? 'BEGINNER CLASS'
            : 'TRUE SMC FAST TRACK'

        const formattedPrice = formatPrice(item.price_cents)
        const availabilityText = item.custom_inclusions && item.custom_inclusions.length > 0 ? item.custom_inclusions[0] : null

        return (
          <article key={item.id} className={`relative overflow-hidden border ${borderClass} bg-secondary p-6 sm:p-8`}>
            <div className="absolute right-6 top-6">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}>
                {statusLabel}
              </span>
            </div>

            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              {categoryLabel}
            </p>
            <h3 className="mt-4 max-w-[22ch] text-2xl font-semibold tracking-[-0.05em] text-foreground">{item.session_title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.display_date}</p>

            {availabilityText ? <p className="mt-3 text-sm font-medium text-primary">{availabilityText}</p> : null}

            {/* Course inclusions or bonuses */}
            {offerKey === 'personal-coaching' && item.course?.bonuses ? (
              <div className="mt-6 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                <p className="font-semibold text-foreground">Pakej</p>
                <ul className="mt-2 space-y-1">
                  {item.course.bonuses.map((inclusion) => <li key={inclusion}>- {inclusion}</li>)}
                </ul>
              </div>
            ) : null}

            {offerKey === 'saham-101' && item.course ? (
              <div className="mt-6 space-y-5 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                {item.course.modules && item.course.modules[0] ? (
                  <div>
                    <p className="font-semibold text-foreground">Content</p>
                    <ul className="mt-2 space-y-1">
                      {item.course.modules[0].lessons.map((topic) => <li key={topic}>- {topic}</li>)}
                    </ul>
                  </div>
                ) : null}
                {item.course.bonuses && item.course.bonuses.length > 0 ? (
                  <div>
                    <p className="font-semibold text-foreground">Bonus</p>
                    <ul className="mt-2 space-y-1">
                      {item.course.bonuses.map((bonus) => <li key={bonus}>- {bonus}</li>)}
                    </ul>
                  </div>
                ) : null}
                {item.course.exclusive_bonus ? (
                  <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
                    <p className="font-semibold text-primary">EXCLUSIVE BONUS: {item.course.exclusive_bonus.title}</p>
                    <ul className="mt-2 space-y-1 text-[color:var(--color-ink-soft)]">
                      {item.course.exclusive_bonus.benefits.map((benefit) => <li key={benefit}>- {benefit}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {offerKey.startsWith('trading-clinic') && item.course?.bonuses ? (
              <div className="mt-6 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                <p className="font-semibold text-foreground">Session ini cover</p>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  {item.course.bonuses.map((topic) => <li key={topic}>- {topic}</li>)}
                </ul>
              </div>
            ) : null}

            <p className="mt-8 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.06em] text-foreground">
              {formattedPrice}
            </p>

            {isAvailable ? (
              <EnrollmentLink offer={offerKey} variant={isCoaching ? 'outline' : 'solid'} className="mt-7 px-5 text-sm font-semibold">
                {isCoaching ? 'Mohon Coaching' : isExtended ? 'Daftar Sesi Rakaman' : 'Daftar Kelas'}
              </EnrollmentLink>
            ) : (
              <button disabled className="mt-7 inline-flex h-10 cursor-not-allowed items-center justify-center whitespace-nowrap rounded-md bg-muted px-5 text-sm font-semibold text-muted-foreground">
                {isUpcoming ? 'Opening Soon' : 'Penuh (Closed)'}
              </button>
            )}
          </article>
        )
      })}
    </div>
  )
}

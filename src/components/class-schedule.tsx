import { EnrollmentLink } from '@/components/enrollment-link'
import { personalCoachingOffer, saham101Offer, tradingClinicOffer } from '@/lib/course'
import { getClassesData } from '@/lib/sheets'

function normaliseStatus(status: string) {
  return status.trim().toLowerCase().replace(/\s+/g, '-')
}

export default async function ClassSchedule() {
  const classes = await getClassesData()

  if (classes.length === 0) return null

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {classes.map((item) => {
        const status = normaliseStatus(item.status)
        const isFull = status === 'full' || status === 'sold-out'
        const isOpeningSoon = status === 'opening-soon' || status === 'opening'
        const isUnavailable = isFull || isOpeningSoon
        const isCoaching = item.offerId === 'personal-coaching' || item.offerId === 'trading-clinic'
        const borderClass = isCoaching ? 'border-primary' : 'border-border'
        const statusLabel = isOpeningSoon ? 'Opening Soon' : isFull ? 'Full' : item.status || 'Open'

        return (
          <article key={item.offerId} className={`relative overflow-hidden border ${borderClass} bg-secondary p-6 sm:p-8`}>
            <div className="absolute right-6 top-6">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${isUnavailable ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                {statusLabel}
              </span>
            </div>

            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              {item.offerId === 'personal-coaching' ? 'PERSONAL COACHING' : item.offerId === 'trading-clinic' ? 'TRADING CLINIC' : item.offerId === 'saham-101' ? 'BEGINNER CLASS' : 'TRUE SMC FAST TRACK'}
            </p>
            <h3 className="mt-4 max-w-[22ch] text-2xl font-semibold tracking-[-0.05em] text-foreground">{item.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.date}</p>

            {item.availability ? <p className="mt-3 text-sm font-medium text-primary">{item.availability}</p> : null}

            {item.offerId === 'personal-coaching' ? (
              <div className="mt-6 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                <p className="font-semibold text-foreground">Pakej</p>
                <ul className="mt-2 space-y-1">
                  {personalCoachingOffer.inclusions.map((inclusion) => <li key={inclusion}>- {inclusion}</li>)}
                </ul>
              </div>
            ) : null}

            {item.offerId === 'saham-101' ? (
              <div className="mt-6 space-y-5 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                <div>
                  <p className="font-semibold text-foreground">Content</p>
                  <ul className="mt-2 space-y-1">
                    {saham101Offer.topics.map((topic) => <li key={topic}>- {topic}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Bonus</p>
                  <ul className="mt-2 space-y-1">
                    {saham101Offer.bonuses.map((bonus) => <li key={bonus}>- {bonus}</li>)}
                  </ul>
                </div>
              </div>
            ) : null}

            {item.offerId === 'trading-clinic' ? (
              <div className="mt-6 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                <p className="font-semibold text-foreground">Session ini cover</p>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  {tradingClinicOffer.topics.map((topic) => <li key={topic}>- {topic}</li>)}
                </ul>
                <p className="mt-4 text-xs leading-5 text-muted-foreground">{tradingClinicOffer.note}</p>
              </div>
            ) : null}

            <p className="mt-8 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.06em] text-foreground">
              {item.price}
            </p>

            {!isUnavailable ? (
              <EnrollmentLink offer={item.offerId} variant={isCoaching ? 'outline' : 'solid'} className="mt-7 px-5 text-sm font-semibold">
                {isCoaching ? 'Mohon Coaching' : 'Daftar Kelas'}
              </EnrollmentLink>
            ) : (
              <button disabled className="mt-7 inline-flex h-10 cursor-not-allowed items-center justify-center whitespace-nowrap rounded-md bg-muted px-5 text-sm font-semibold text-muted-foreground">
                {isOpeningSoon ? 'Opening Soon' : 'Penuh (Sold Out)'}
              </button>
            )}
          </article>
        )
      })}
    </div>
  )
}

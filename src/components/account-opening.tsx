import { EnrollmentLink } from '@/components/enrollment-link'

const platforms = [
  ['M+', 'Mplus'],
  ['moomoo', 'moomoo'],
  ['Phillip', 'Phillip Capital'],
]

export function AccountOpening() {
  return (
    <section id="buka-akaun" className="scroll-mt-32 px-5 py-16 sm:px-8 sm:py-20 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">ADDITIONAL SERVICE</p>
            <h2 className="mt-4 max-w-[11ch] text-[clamp(2rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
              Buka Akaun.
            </h2>
          </div>
          <p className="max-w-[60ch] text-base leading-7 text-[color:var(--color-ink-soft)] sm:text-lg">
            Dapatkan bantuan untuk membuka akaun trading dengan platform pilihan anda.
          </p>
        </div>
        <div className="mt-10 grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {platforms.map(([shortName, fullName]) => (
            <article key={fullName} className="flex min-h-64 flex-col justify-between px-0 py-7 md:px-7 lg:px-9">
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.06em] text-foreground">{shortName}</p>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.035em] text-foreground">{fullName}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">Mohon bantuan pembukaan akaun dengan {fullName}.</p>
              </div>
              <EnrollmentLink offer="account" variant="outline" className="mt-8 w-fit px-4 text-sm font-semibold">
                Mohon bantuan
              </EnrollmentLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import { courseOffer } from '@/lib/course'
import ClassSchedule from '@/components/class-schedule'

export function CourseDetails() {
  return (
    <section id="kelas" className="scroll-mt-32 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 bg-background">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-12 pb-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">TRUE SMC FAST TRACK</p>
            <h2 className="mt-4 max-w-[13ch] text-[clamp(2rem,4.5vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-foreground">
              Kursus lengkap dari konsep sehingga execution.
            </h2>
          </div>
          <div className="rounded-3xl bg-primary/5 p-8 sm:p-10">
            <p className="font-mono text-[0.66rem] font-bold tracking-[0.1em] text-primary">NEXT CLASS</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.05em] text-foreground">{courseOffer.nextClass}</p>
            <p className="mt-4 max-w-[60ch] text-sm leading-6 text-foreground/80">
              Teknik ini merupakan teknik advanced dan hanya sesuai untuk trader yang telah mempunyai ilmu asas trading.
            </p>
          </div>
        </div>

        <div className="grid gap-12 py-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
          <div className="space-y-12">
            {courseOffer.modules.map((module) => (
              <article key={module.number} className="grid gap-5 sm:grid-cols-[4.5rem_minmax(0,1fr)] rounded-3xl border border-border/40 bg-card p-8 shadow-sm transition-shadow hover:shadow-md sm:p-10">
                <p className="font-mono text-2xl font-bold text-primary/80">{module.number}</p>
                <div>
                  <h3 className="text-2xl font-bold tracking-[-0.045em] text-foreground">{module.title}</h3>
                  <ul className="mt-6 grid gap-x-6 gap-y-4 text-sm leading-6 text-foreground/70 sm:grid-cols-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-primary/80" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <aside className="self-start rounded-3xl border border-border/50 bg-card p-8 shadow-sm sm:p-10">
            <p className="font-mono text-xs font-bold tracking-[0.14em] text-primary">BONUSES</p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-foreground/80">
              {courseOffer.bonuses.map((bonus) => (
                <li key={bonus} className="flex gap-3">
                   <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
                   {bonus}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl bg-primary/10 p-6">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.14em] text-primary">EXCLUSIVE BONUS</p>
              <h3 className="mt-3 text-xl font-bold tracking-[-0.04em] text-foreground">{courseOffer.exclusiveBonus.title}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-foreground/80">
                {courseOffer.exclusiveBonus.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-16 rounded-3xl bg-muted/30 p-8 sm:p-12">
          <ClassSchedule />
          <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
            Bayaran yang telah dibuat adalah non-refundable.
          </p>
        </div>
      </div>
    </section>
  )
}


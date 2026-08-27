import { EnrollmentLink } from '@/components/enrollment-link'
import { coachingOffer, courseOffer } from '@/lib/course'
import ClassSchedule from '@/components/class-schedule'

export function CourseDetails() {
  return (
    <section id="kelas" className="scroll-mt-32 border-y border-border px-5 py-16 sm:px-8 sm:py-20 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">TRUE SMC FAST TRACK</p>
            <h2 className="mt-4 max-w-[13ch] text-[clamp(2rem,4.5vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-foreground">
              Kursus lengkap dari konsep sehingga execution.
            </h2>
          </div>
          <div className="border-l border-primary pl-5 sm:pl-7">
            <p className="font-mono text-[0.66rem] tracking-[0.1em] text-muted-foreground">NEXT CLASS</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[-0.05em] text-foreground">{courseOffer.nextClass}</p>
            <p className="mt-4 max-w-[60ch] text-sm leading-6 text-[color:var(--color-ink-soft)]">
              Teknik ini merupakan teknik advanced dan hanya sesuai untuk trader yang telah mempunyai ilmu asas trading.
            </p>
          </div>
        </div>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
          <div className="space-y-10">
            {courseOffer.modules.map((module) => (
              <article key={module.number} className="grid gap-5 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
                <p className="font-mono text-lg font-medium text-primary">{module.number}</p>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.045em] text-foreground">{module.title}</h3>
                  <ul className="mt-5 grid gap-x-6 gap-y-3 text-sm leading-6 text-[color:var(--color-ink-soft)] sm:grid-cols-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <aside className="border-l border-primary pl-6 sm:pl-8">
            <p className="font-mono text-xs font-medium tracking-[0.14em] text-primary">BONUSES</p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-[color:var(--color-ink-soft)]">
              {courseOffer.bonuses.map((bonus) => <li key={bonus}>{bonus}</li>)}
            </ul>
            <div className="mt-10 border-t border-border pt-6">
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-primary">EXCLUSIVE BONUS</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">{courseOffer.exclusiveBonus.title}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                {courseOffer.exclusiveBonus.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
              </ul>
            </div>
          </aside>
        </div>

        <div className="border-t border-border pt-8">
          <ClassSchedule />
        </div>
      </div>
    </section>
  )
}

import { ArrowDown } from 'lucide-react'

import { getCourseBySlug, getClassSessionByOffer } from '@/lib/db/courses'
import ClassSchedule from '@/components/class-schedule'

export async function CourseDetails() {
  const [course, session] = await Promise.all([
    getCourseBySlug('fast-track'),
    getClassSessionByOffer('fast-track'),
  ])

  const nextClassDate = session?.display_date || 'November 2026'
  const modules = course?.modules || []
  const bonuses = course?.bonuses || []
  const exclusiveBonus = course?.exclusive_bonus

  return (
    <section id="kelas" className="bg-background px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-10 pb-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <p className="eyebrow">True SMC Fast Track</p>
            <h2 className="mt-4 max-w-[13ch] text-[clamp(2rem,4.5vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-foreground">
              Kursus lengkap dari konsep sehingga execution.
            </h2>
          </div>
          <div className="surface-tint flex flex-col gap-6 p-7 sm:flex-row sm:items-end sm:justify-between sm:p-8">
            <div>
              <p className="font-mono text-[0.68rem] font-medium tracking-[0.12em] text-primary">NEXT CLASS</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-foreground">
                {nextClassDate}
              </p>
              <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[color:var(--color-ink-soft)]">
                Teknik advanced — sesuai untuk trader yang telah mempunyai ilmu asas trading.
              </p>
            </div>
            <a href="#jadual" className="enroll-outline shrink-0 px-5 text-sm font-semibold">
              Lihat jadual &amp; harga
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)] lg:gap-8">
          <div className="space-y-6">
            {modules.map((module) => (
              <article key={module.number} className="surface-card grid gap-5 p-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:p-9">
                <p className="font-mono text-2xl font-medium text-primary">{module.number}</p>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.045em] text-foreground">{module.title}</h3>
                  <ul className="mt-6 grid gap-x-6 gap-y-3 text-sm leading-6 text-[color:var(--color-ink-soft)] sm:grid-cols-2">
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

          <aside className="surface-card self-start p-7 sm:p-9">
            <p className="eyebrow">Bonuses</p>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-[color:var(--color-ink-soft)]">
              {bonuses.map((bonus) => (
                <li key={bonus} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {bonus}
                </li>
              ))}
            </ul>
            {exclusiveBonus ? (
              <div className="surface-tint mt-8 p-5 sm:p-6">
                <p className="font-mono text-[0.68rem] font-medium tracking-[0.14em] text-primary">
                  {exclusiveBonus.badge_label || 'EXCLUSIVE BONUS'}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">{exclusiveBonus.title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                  {exclusiveBonus.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>

        <div id="jadual" className="mt-20 border-t border-border pt-14">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Jadual &amp; harga</p>
              <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.5rem)] font-semibold tracking-[-0.05em] text-foreground">
                Pilih kelas anda.
              </h3>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">Bayaran yang telah dibuat adalah non-refundable.</p>
          </div>
          <ClassSchedule />
        </div>
      </div>
    </section>
  )
}

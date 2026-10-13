import Link from 'next/link'
import { GraduationCap, Edit3, BookOpen, Gift, Send } from 'lucide-react'
import { getCourses } from '@/lib/db/courses'

function formatPrice(cents: number) {
  return `RM${(cents / 100).toFixed(0)}`
}

export default async function AdminCoursesPage() {
  const courses = await getCourses()

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Katalog Kursus &amp; Silibus
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Urus kurikulum pengajian, senarai bonus biasa, dan kotak sorotan Exclusive Bonus.
        </p>
      </div>

      <div className="grid gap-5">
        {courses.map((course) => {
          return (
            <div
              key={course.id}
              className="rounded-xl border border-border bg-secondary/20 p-5 sm:p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-lg text-foreground">{course.title}</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {course.category}
                    </span>
                    <span className="text-xs text-muted-foreground">Oleh {course.educator}</span>
                  </div>

                  <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-y-1 gap-x-4 pt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      Yuran Asas: {formatPrice(course.default_price_cents)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-primary" />
                      {course.modules?.length || 0} Modul Silibus
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Gift className="size-3.5 text-primary" />
                      {course.bonuses?.length || 0} Bonus
                    </span>
                    {course.exclusive_bonus ? (
                      <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        + Exclusive Bonus Aktif
                      </span>
                    ) : null}
                  </div>

                  {course.default_telegram_link ? (
                    <p className="text-[11px] font-mono text-muted-foreground pt-1">
                      Telegram Induk: <span className="text-primary">{course.default_telegram_link}</span>
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="enroll-solid inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold shadow-sm"
                  >
                    <Edit3 className="size-3.5" />
                    Urus Silibus &amp; Bonus
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

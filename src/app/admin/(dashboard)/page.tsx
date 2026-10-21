import Link from 'next/link'
import {
  CalendarDays,
  GraduationCap,
  Tag,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { getCourses, getAllClassSessions } from '@/lib/db/courses'
import { updateClassStatus } from '@/actions/classes'
import type { ClassStatus } from '@/types/database'

function formatPrice(cents: number) {
  return `RM${(cents / 100).toFixed(0)}`
}

export default async function AdminDashboardOverview() {
  const [courses, sessions] = await Promise.all([
    getCourses(),
    getAllClassSessions(),
  ])

  const now = new Date()
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

  // Find classes older than 30 days that are not yet marked as 'closed', 'archived', or 'completed_registering'
  const classesNeedingReview = sessions.filter((s) => {
    if (s.status === 'closed' || s.status === 'archived' || s.status === 'completed_registering') return false
    const dateToCheck = s.end_date || s.start_date
    if (!dateToCheck) return false
    const elapsed = now.getTime() - new Date(dateToCheck).getTime()
    return elapsed > thirtyDaysMs
  })

  const openCount = sessions.filter((s) => s.status === 'open' || s.status === 'completed_registering').length
  const upcomingCount = sessions.filter((s) => s.status === 'upcoming').length
  const archivedCount = sessions.filter((s) => s.status === 'archived').length
  const activeCount = sessions.filter((s) => s.status !== 'archived').length

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ringkasan Pengurusan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau status kelas, pendaftaran terbuka, dan konfigurasi kandungan.
          </p>
        </div>

        <Link
          href="/admin/classes/new"
          className="enroll-solid inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold shadow-sm w-fit"
        >
          <Plus className="size-4" />
          Jadualkan Kelas Baru
        </Link>
      </div>

      {/* Lifecycle Assistant Alert (if any classes >30 days need review) */}
      {classesNeedingReview.length > 0 ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-foreground">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-sm text-amber-500">
                Peringatan Kitaran Hayat Kelas (Lebih 30 Hari)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kelas berikut telah berlangsung lebih daripada 30 hari. Mengikut polisi sistem, pendaftaran rakaman boleh ditutup secara manual oleh pentadbir:
              </p>

              <div className="space-y-3 pt-2">
                {classesNeedingReview.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-background/80 p-3"
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">{cls.session_title}</p>
                      <p className="text-xs text-muted-foreground">
                        Tarikh: {cls.display_date} · Status semasa: <span className="text-primary uppercase font-mono">{cls.status}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <form
                        action={async () => {
                          'use server'
                          await updateClassStatus(cls.id, 'closed')
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          Tutup Pendaftaran (Closed)
                        </button>
                      </form>

                      <form
                        action={async () => {
                          'use server'
                          await updateClassStatus(cls.id, 'completed_registering')
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          Kekalkan Sesi Rakaman
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-secondary/30 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pendaftaran Aktif
            </span>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <CalendarDays className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
            {openCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {upcomingCount} sesi berstatus &apos;Opening Soon&apos;
          </p>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Katalog Kursus
            </span>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <GraduationCap className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
            {courses.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Termasuk True SMC Fast Track &amp; Saham 101
          </p>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Jumlah Sesi Berjadual
            </span>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Clock className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
            {sessions.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {activeCount} aktif {archivedCount > 0 ? `· ${archivedCount} diarkibkan` : ''}
          </p>
        </div>
      </div>

      {/* Class Sessions Overview Table */}
      <div className="rounded-xl border border-border bg-secondary/20 p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="font-semibold text-base text-foreground">
              Sesi Kelas Semasa
            </h2>
            <p className="text-xs text-muted-foreground">
              Status dan pautan kumpulan Telegram bagi setiap intake.
            </p>
          </div>
          <Link
            href="/admin/classes"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Urus Semua <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-border overflow-x-auto">
          {sessions.map((cls) => {
            const effectiveTg = cls.telegram_link_override || cls.course?.default_telegram_link || 'Belum Ditetapkan'
            return (
              <div key={cls.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{cls.session_title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        cls.status === 'open'
                          ? 'bg-primary/10 text-primary'
                          : cls.status === 'completed_registering'
                          ? 'bg-amber-500/10 text-amber-500'
                          : cls.status === 'upcoming'
                          ? 'bg-blue-500/10 text-blue-400'
                          : cls.status === 'archived'
                          ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {cls.status === 'completed_registering'
                        ? 'Sesi Rakaman'
                        : cls.status === 'archived'
                        ? 'Diarkibkan'
                        : cls.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tarikh: {cls.display_date} · Yuran: <span className="font-medium text-foreground">{formatPrice(cls.price_cents)}</span>
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground truncate max-w-md">
                    Telegram: <span className="text-primary">{effectiveTg}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/classes/${cls.id}`}
                    className="rounded border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    Kemaskini
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

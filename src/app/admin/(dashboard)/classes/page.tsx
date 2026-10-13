import Link from 'next/link'
import { Plus, Edit3, ExternalLink, Calendar, Clock, DollarSign } from 'lucide-react'
import { getPublicClassSessions } from '@/lib/db/courses'
import { updateClassStatus } from '@/actions/classes'
import { DeleteClassButton } from '@/components/admin/delete-class-button'
import type { ClassStatus } from '@/types/database'

function formatPrice(cents: number) {
  return `RM${(cents / 100).toFixed(0)}`
}

export default async function AdminClassesPage() {
  const sessions = await getPublicClassSessions()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Pengurusan Sesi Kelas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cipta, kemaskini intake, ubah pautan Telegram, dan kawal status pendaftaran.
          </p>
        </div>

        <Link
          href="/admin/classes/new"
          className="enroll-solid inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold shadow-sm w-fit"
        >
          <Plus className="size-4" />
          Tambah Sesi Baru
        </Link>
      </div>

      <div className="grid gap-4">
        {sessions.map((cls) => {
          const effectiveTg = cls.telegram_link_override || cls.course?.default_telegram_link || 'Tiada pautan'
          return (
            <div
              key={cls.id}
              className="rounded-xl border border-border bg-secondary/20 p-5 sm:p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-base text-foreground">{cls.session_title}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                        cls.status === 'open'
                          ? 'bg-primary/10 text-primary'
                          : cls.status === 'completed_registering'
                          ? 'bg-amber-500/10 text-amber-500'
                          : cls.status === 'upcoming'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {cls.status === 'completed_registering' ? 'Sesi Rakaman' : cls.status}
                    </span>
                    {cls.is_featured ? (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-primary" />
                      {cls.display_date}
                    </span>
                    {cls.display_time ? (
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" />
                        {cls.display_time}
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <DollarSign className="size-3.5 text-primary" />
                      {formatPrice(cls.price_cents)}
                    </span>
                  </div>

                  <div className="pt-1 text-xs">
                    <span className="text-muted-foreground">Pautan Telegram: </span>
                    <a
                      href={effectiveTg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {effectiveTg} <ExternalLink className="size-3" />
                    </a>
                    {cls.telegram_link_override ? (
                      <span className="ml-2 text-[10px] text-amber-400">(Override Sesi)</span>
                    ) : (
                      <span className="ml-2 text-[10px] text-muted-foreground">(Default Kursus)</span>
                    )}
                  </div>
                </div>

                {/* Status Changer & Edit Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <form
                    action={async (formData: FormData) => {
                      'use server'
                      const newStatus = formData.get('status') as ClassStatus
                      await updateClassStatus(cls.id, newStatus)
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <select
                      name="status"
                      defaultValue={cls.status}
                      className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="upcoming">Upcoming (Opening Soon)</option>
                      <option value="open">Open (Pendaftaran Aktif)</option>
                      <option value="completed_registering">Completed (Rakaman)</option>
                      <option value="closed">Closed (Penuh/Tutup)</option>
                      <option value="archived">Archived (Sembunyi)</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                    >
                      Tukar
                    </button>
                  </form>

                  <Link
                    href={`/admin/classes/${cls.id}`}
                    className="rounded border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors inline-flex items-center gap-1.5"
                  >
                    <Edit3 className="size-3.5" />
                    Kemaskini
                  </Link>

                  <DeleteClassButton id={cls.id} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

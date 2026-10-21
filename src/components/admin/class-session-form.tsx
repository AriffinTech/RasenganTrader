'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Info } from 'lucide-react'
import { saveClassSession } from '@/actions/classes'
import { PosterUploader } from '@/components/admin/poster-uploader'
import type { Course, ClassSession, ClassStatus } from '@/types/database'

type ClassSessionFormProps = {
  courses: Course[]
  session?: ClassSession | null
}

export function ClassSessionForm({ courses, session }: ClassSessionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = Boolean(session?.id)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    session?.course_id || (courses[0]?.id ?? '')
  )

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await saveClassSession(formData)

    setLoading(false)

    if (result && result.error) {
      setError(result.error)
    } else {
      router.push('/admin/classes')
      router.refresh()
    }
  }

  // Helper date converters for HTML datetime-local
  const formatForInput = (isoDate?: string | null) => {
    if (!isoDate) return ''
    try {
      return new Date(isoDate).toISOString().slice(0, 16)
    } catch {
      return ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {session?.id ? <input type="hidden" name="id" value={session.id} /> : null}

      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/admin/classes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke Senarai Kelas
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="enroll-solid inline-flex items-center gap-2 rounded-md px-5 py-2 text-xs font-semibold shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          {isEditing ? 'Simpan Perubahan' : 'Cipta Sesi Kelas'}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
          {error}
        </div>
      ) : null}

      {/* Main Metadata */}
      <div className="rounded-xl border border-border bg-secondary/20 p-6 space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          1. Maklumat Kursus &amp; Sesi
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Pilih Kursus Asas <span className="text-primary">*</span>
            </label>
            <select
              required
              name="course_id"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground">
              Tajuk Paparan Sesi <span className="text-primary">*</span>
            </label>
            <input
              required
              name="session_title"
              defaultValue={session?.session_title || selectedCourse?.title || ''}
              placeholder="Contoh: True SMC Fast Track - Intake November 2026"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Tarikh Paparan (Teks Awam) <span className="text-primary">*</span>
            </label>
            <input
              required
              name="display_date"
              defaultValue={session?.display_date || ''}
              placeholder="Contoh: November 2026 atau 14 & 15 November 2026"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground">
              Masa Paparan (Pilihan)
            </label>
            <input
              name="display_time"
              defaultValue={session?.display_time || ''}
              placeholder="Contoh: 9.30am - 12.00pm, 9.00pm - 11.00pm"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Yuran Pendaftaran (RM) <span className="text-primary">*</span>
            </label>
            <input
              required
              type="number"
              step="1"
              name="price_rm"
              defaultValue={
                session?.price_cents
                  ? session.price_cents / 100
                  : selectedCourse?.default_price_cents
                  ? selectedCourse.default_price_cents / 100
                  : 499
              }
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground">
              Status Pendaftaran Sesi <span className="text-primary">*</span>
            </label>
            <select
              name="status"
              defaultValue={session?.status || 'upcoming'}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="upcoming">Upcoming (Opening Soon)</option>
              <option value="open">Open (Pendaftaran Dibuka)</option>
              <option value="completed_registering">
                Completed (Sesi Rakaman Masih Dibuka ~1 Bulan)
              </option>
              <option value="closed">Closed (Pendaftaran Ditutup)</option>
              <option value="archived">Archived (Sembunyi dari Laman Awam)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground">
              No. Urutan Susunan (Sort Order)
            </label>
            <input
              type="number"
              name="sort_order"
              defaultValue={session?.sort_order ?? 1}
              min="1"
              max="99"
              placeholder="Contoh: 1 (paling atas)"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Nombor 1 akan dipaparkan paling awal/atas di laman utama.
            </p>
          </div>
        </div>

        {/* Concrete timestamps for 30-day lifecycle automation */}
        <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-border">
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Tarikh Mula Kelas (Untuk Pengiraan Automatik)
            </label>
            <input
              type="datetime-local"
              name="start_date"
              defaultValue={formatForInput(session?.start_date)}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Digunakan untuk menyusun jadual kelas secara kronologi.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground">
              Tarikh Tamat Kelas (Untuk Pengiraan 30 Hari Rakaman)
            </label>
            <input
              type="datetime-local"
              name="end_date"
              defaultValue={formatForInput(session?.end_date)}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Sistem akan memberi amaran di dashboard selepas 30 hari dari tarikh ini untuk menutup pendaftaran.
            </p>
          </div>
        </div>
      </div>

      {/* Telegram Link Management */}
      <div className="rounded-xl border border-border bg-secondary/20 p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          2. Integrasi Kumpulan Telegram
        </h2>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-foreground/80 flex items-start gap-2.5">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Peraturan Pautan Telegram:</p>
            <p className="mt-0.5 text-muted-foreground">
              Secara default, sesi ini akan menggunakan pautan Telegram kursus utama:{' '}
              <span className="font-mono text-primary">{selectedCourse?.default_telegram_link || 'Belum ditetapkan'}</span>.
              Jika intake ini mempunyai group khas berasingan, masukkan pautan di bawah.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground">
            Pautan Telegram Khas Sesi Ini (Pilihan Override)
          </label>
          <input
            name="telegram_link_override"
            defaultValue={session?.telegram_link_override || ''}
            placeholder="https://t.me/+AbCdEfGhIjK..."
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary font-mono"
          />
        </div>
      </div>

      {/* Poster Upload Section */}
      <div className="rounded-xl border border-border bg-secondary/20 p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          3. Poster &amp; Bahan Visual Kelas
        </h2>

        <PosterUploader
          initialUrl={session?.poster_url_override || selectedCourse?.poster_url}
          fieldName="poster_url_override"
        />
      </div>

      {/* Custom Inclusions */}
      <div className="rounded-xl border border-border bg-secondary/20 p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          4. Catatan Khas / Inclusions Tambahan
        </h2>

        <div>
          <label className="block text-xs font-semibold text-foreground">
            Nota Ketersediaan / Tambahan (Satu baris untuk setiap item)
          </label>
          <textarea
            name="custom_inclusions"
            rows={3}
            defaultValue={session?.custom_inclusions?.join('\n') || ''}
            placeholder="Contoh: 3 slot per month&#10;Rakaman sesi disediakan"
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>
    </form>
  )
}

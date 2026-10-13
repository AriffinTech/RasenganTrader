'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Plus, Trash2, Sparkles, BookOpen } from 'lucide-react'
import { saveCourse } from '@/actions/courses'
import type { Course, CourseModule } from '@/types/database'

type CourseEditorFormProps = {
  course: Course
}

export function CourseEditorForm({ course }: CourseEditorFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modules state
  const [modules, setModules] = useState<CourseModule[]>(course.modules || [])

  // Exclusive bonus live preview states
  const [exclusiveTitle, setExclusiveTitle] = useState(course.exclusive_bonus?.title || '')
  const [exclusiveBadge, setExclusiveBadge] = useState(course.exclusive_bonus?.badge_label || 'EXCLUSIVE BONUS')
  const [exclusiveBenefits, setExclusiveBenefits] = useState(
    course.exclusive_bonus?.benefits?.join('\n') || ''
  )

  const parsedBenefits = exclusiveBenefits
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  function addModule() {
    const nextNum = (modules.length + 1).toString().padStart(2, '0')
    setModules([
      ...modules,
      {
        number: nextNum,
        title: `Modul ${nextNum}: Tajuk Baru`,
        lessons: ['Topik pembelajaran 1', 'Topik pembelajaran 2'],
      },
    ])
  }

  function removeModule(index: number) {
    setModules(modules.filter((_, i) => i !== index))
  }

  function updateModuleTitle(index: number, title: string) {
    const updated = [...modules]
    updated[index].title = title
    setModules(updated)
  }

  function updateModuleLessons(index: number, text: string) {
    const updated = [...modules]
    updated[index].lessons = text.split('\n').map((s) => s.trim()).filter(Boolean)
    setModules(updated)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('modules_json', JSON.stringify(modules))

    const result = await saveCourse(formData)
    setLoading(false)

    if (result && result.error) {
      setError(result.error)
    } else {
      router.push('/admin/courses')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <input type="hidden" name="id" value={course.id} />

      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke Katalog
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="enroll-solid inline-flex items-center gap-2 rounded-md px-5 py-2 text-xs font-semibold shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Simpan Semua Perubahan
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
          {error}
        </div>
      ) : null}

      {/* 1. Basic Metadata */}
      <div className="rounded-xl border border-border bg-secondary/20 p-6 space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          1. Maklumat Asas Kursus
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Tajuk Kursus <span className="text-primary">*</span>
            </label>
            <input
              required
              name="title"
              defaultValue={course.title}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground">
              Pengajar / Educator <span className="text-primary">*</span>
            </label>
            <input
              required
              name="educator"
              defaultValue={course.educator}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Yuran Asas Default (RM)
            </label>
            <input
              type="number"
              step="1"
              name="default_price_rm"
              defaultValue={course.default_price_cents / 100}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground">
              Pautan Default Group Telegram
            </label>
            <input
              name="default_telegram_link"
              defaultValue={course.default_telegram_link || ''}
              placeholder="https://t.me/+Bc8UkVt2yHMzMzRl"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary font-mono"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Pautan ini akan diwarisi secara automatik oleh semua intake akan datang melainkan dioverride.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground">
            Penerangan Ringkas
          </label>
          <textarea
            name="description"
            rows={2}
            defaultValue={course.description}
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* 2. Regular Bonuses Editor */}
      <div className="rounded-xl border border-border bg-secondary/20 p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          2. Senarai Bonus Biasa (Standard Bonuses)
        </h2>
        <p className="text-xs text-muted-foreground">
          Masukkan satu bonus untuk setiap baris. Bonus ini dipaparkan dalam bentuk senarai semak pada bahagian tepi jadual kursus.
        </p>

        <textarea
          name="bonuses"
          rows={6}
          defaultValue={course.bonuses?.join('\n') || ''}
          placeholder="Contoh:&#10;100 Backtested Setup Journal&#10;3 Months Group Support (Live Trade & Review)&#10;Personal SOP Blueprint"
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary font-mono"
        />
      </div>

      {/* 3. Exclusive Bonus Highlight Box (Crucial client requirement) */}
      <div className="rounded-xl border border-border bg-secondary/20 p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            3. Kotak Sorotan Exclusive Bonus (Visually Highlighted Box)
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Bahagian ini dipaparkan dengan kotak emas premium (`bg-primary/10 ring-primary/20`) pada laman utama bagi menarik perhatian peserta.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Tajuk Exclusive Bonus
            </label>
            <input
              name="exclusive_title"
              value={exclusiveTitle}
              onChange={(e) => setExclusiveTitle(e.target.value)}
              placeholder="Contoh: New Momentum Strategy: SPC Setup"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground">
              Label Lencana (Badge Label)
            </label>
            <input
              name="exclusive_badge"
              value={exclusiveBadge}
              onChange={(e) => setExclusiveBadge(e.target.value)}
              placeholder="EXCLUSIVE BONUS"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary font-mono text-xs uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground">
            Faedah &amp; Kebaikan Exclusive Bonus (Satu baris setiap item)
          </label>
          <textarea
            name="exclusive_benefits"
            rows={4}
            value={exclusiveBenefits}
            onChange={(e) => setExclusiveBenefits(e.target.value)}
            placeholder="Contoh:&#10;Teknik entry momentum tinggi&#10;Risk-to-reward ratio 1:3 minimum&#10;Sesuai untuk swing dan intraday trading"
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary font-mono"
          />
        </div>

        {/* Live Visual Preview of Exclusive Bonus */}
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pratonton Visual Langsung (Seperti di Laman Utama):
          </p>
          {exclusiveTitle ? (
            <div className="rounded-2xl bg-primary/10 p-6 ring-1 ring-primary/20 max-w-lg">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.14em] text-primary">
                {exclusiveBadge || 'EXCLUSIVE BONUS'}
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-[-0.04em] text-foreground">
                {exclusiveTitle}
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground/80">
                {parsedBenefits.map((b, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Tiada exclusive bonus dikonfigurasikan. Kotak ini tidak akan dipaparkan di laman utama.
            </p>
          )}
        </div>
      </div>

      {/* 4. Curriculum Modules Builder */}
      <div className="rounded-xl border border-border bg-secondary/20 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              4. Silibus &amp; Modul Pembelajaran ({modules.length} Modul)
            </h2>
          </div>

          <button
            type="button"
            onClick={addModule}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <Plus className="size-3.5 text-primary" />
            Tambah Modul
          </button>
        </div>

        <div className="space-y-4">
          {modules.map((m, index) => (
            <div key={index} className="rounded-lg border border-border bg-background p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold text-primary px-2 py-1 rounded bg-primary/10">
                  {m.number}
                </span>
                <input
                  value={m.title}
                  onChange={(e) => updateModuleTitle(index, e.target.value)}
                  placeholder="Tajuk Modul"
                  className="flex-1 rounded border border-border bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeModule(index)}
                  className="rounded p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground">
                  Topik / Lesson Pelajaran (Satu baris untuk setiap topik):
                </label>
                <textarea
                  rows={3}
                  value={m.lessons.join('\n')}
                  onChange={(e) => updateModuleLessons(index, e.target.value)}
                  placeholder="Topik 1&#10;Topik 2"
                  className="mt-1 w-full rounded border border-border bg-secondary/20 px-3 py-2 text-xs text-foreground outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}

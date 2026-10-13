'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Tag, Trash2, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { saveDiscountCode, toggleDiscountStatus, deleteDiscountCode } from '@/actions/discounts'
import type { DiscountCode, Course } from '@/types/database'

type Props = {
  initialDiscounts: DiscountCode[]
  courses: Course[]
}

export function DiscountCodeManager({ initialDiscounts, courses }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed')

  async function handleCreateDiscount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await saveDiscountCode(formData)
    setLoading(false)

    if (result && result.error) {
      setError(result.error)
    } else {
      setShowModal(false)
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Pengurusan Kupon &amp; Kod Diskaun
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hasilkan kod promosi tetap (RM) atau peratusan (%) yang disahkan secara automatik pada gateway Billplz.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="enroll-solid inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold shadow-sm w-fit"
        >
          <Plus className="size-4" />
          Hasilkan Kod Baru
        </button>
      </div>

      {/* Creation Modal */}
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-secondary p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-primary" />
                <h2 className="font-semibold text-base text-foreground">
                  Cipta Kod Diskaun Baru
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleCreateDiscount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Kod Diskaun (Auto Huruf Besar) <span className="text-primary">*</span>
                </label>
                <input
                  required
                  name="code"
                  placeholder="Contoh: FAST50, RAYA15"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm uppercase font-mono text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Jenis Diskaun <span className="text-primary">*</span>
                  </label>
                  <select
                    name="discount_type"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="fixed">Jumlah Tetap (RM)</option>
                    <option value="percentage">Peratusan (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Nilai Diskaun {discountType === 'fixed' ? '(RM)' : '(%)'} <span className="text-primary">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="1"
                    min="1"
                    name="discount_value"
                    placeholder={discountType === 'fixed' ? 'Contoh: 50' : 'Contoh: 15'}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Had Kursus
                </label>
                <select
                  name="course_id"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">Sah Untuk Semua Kursus &amp; Sesi</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      Khas untuk: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Tamat Tempoh (Pilihan)
                  </label>
                  <input
                    type="date"
                    name="valid_until"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Had Penggunaan (Pilihan)
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="max_uses"
                    placeholder="Contoh: 50 (Kosong = Tiada Had)"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  defaultChecked
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="is_active" className="text-xs font-medium text-foreground">
                  Aktifkan serta-merta
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="enroll-solid rounded px-5 py-2 text-xs font-semibold shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  Simpan Kod Diskaun
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Discount Codes Table */}
      <div className="rounded-xl border border-border bg-secondary/20 p-5 overflow-x-auto">
        {initialDiscounts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground space-y-2">
            <Tag className="size-8 mx-auto opacity-40 text-primary" />
            <p className="text-sm">Belum ada kod diskaun yang dicipta.</p>
            <p className="text-xs">Tekan butang &quot;Hasilkan Kod Baru&quot; di atas untuk mula mencipta kupon.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase font-mono">
                <th className="pb-3 font-semibold">Kod</th>
                <th className="pb-3 font-semibold">Nilai Potongan</th>
                <th className="pb-3 font-semibold">Kelayakan Kursus</th>
                <th className="pb-3 font-semibold">Penggunaan</th>
                <th className="pb-3 font-semibold">Tamat Tempoh</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialDiscounts.map((discount) => {
                const isExpired = discount.valid_until && new Date(discount.valid_until) < new Date()
                const isLimitReached = discount.max_uses !== null && discount.times_used >= discount.max_uses
                return (
                  <tr key={discount.id} className="py-3">
                    <td className="py-3 font-mono font-bold text-primary text-sm">
                      {discount.code}
                    </td>
                    <td className="py-3 font-medium text-foreground">
                      {discount.discount_type === 'fixed'
                        ? `RM${(discount.discount_value / 100).toFixed(0)} OFF`
                        : `${discount.discount_value}% OFF`}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {discount.course ? discount.course.title : 'Semua Kursus'}
                    </td>
                    <td className="py-3 text-foreground font-mono">
                      {discount.times_used} {discount.max_uses ? `/ ${discount.max_uses}` : 'kali'}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {discount.valid_until
                        ? new Date(discount.valid_until).toLocaleDateString('ms-MY')
                        : 'Tiada Had'}
                    </td>
                    <td className="py-3">
                      {isExpired ? (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                          Tamat Tempoh
                        </span>
                      ) : isLimitReached ? (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                          Had Dicapai
                        </span>
                      ) : discount.is_active ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Aktif
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Nyahaktif
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            await toggleDiscountStatus(discount.id, !discount.is_active)
                            router.refresh()
                          }}
                          className="rounded border border-border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-secondary"
                        >
                          {discount.is_active ? 'Nyahaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Padam kod ${discount.code}?`)) {
                              await deleteDiscountCode(discount.id)
                              router.refresh()
                            }
                          }}
                          className="rounded p-1 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

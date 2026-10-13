'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { loginAdmin } from '@/actions/auth'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('error') === 'unauthorized') {
        setError('Akses dinafikan. Akaun anda bukan pentadbir yang sah.')
      }
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await loginAdmin(formData)

    if (result && result.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md border border-border bg-secondary/40 p-8 sm:p-10 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-7" />
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground">
            RasenganTrader Admin
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-mono">
            Portal Pengurusan Kandungan
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Emel Pentadbir
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                required
                name="email"
                type="email"
                placeholder="admin@rasengantrader.com"
                className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kata Laluan
            </label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                required
                name="password"
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="enroll-solid mt-6 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mengesahkan...
              </>
            ) : (
              <>
                Log Masuk Dashboard
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Akses terhad khusus untuk pentadbir rasmi RasenganTrader sahaja.
        </p>
      </div>
    </div>
  )
}

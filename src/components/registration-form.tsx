'use client'

import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

import { courseOffer } from '@/lib/course'

type RegistrationFormProps = {
  checkoutUrl?: string
}

export function RegistrationForm({ checkoutUrl }: RegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (checkoutUrl) {
      window.location.assign(checkoutUrl)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="border border-primary bg-secondary p-7 sm:p-10">
        <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">Pendaftaran mockup diterima.</h2>
        <p className="mt-4 max-w-lg leading-7 text-[color:var(--color-ink-soft)]">
          Terima kasih. Sambungan ke payment gateway akan ditambah sebelum pendaftaran rasmi dilancarkan.
        </p>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Kembali ke halaman utama
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border bg-secondary p-6 sm:p-8">
      <div className="flex items-start justify-between gap-5 border-b border-border pb-6">
        <div>
          <p className="font-mono text-xs tracking-[0.14em] text-primary">REGISTRATION</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-foreground">Tempah tempat anda.</h2>
        </div>
        <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.06em] text-foreground">{courseOffer.price}</p>
      </div>

      <div className="mt-7 grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Nama penuh
          <input required name="name" autoComplete="name" className="min-h-11 border border-border bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-primary" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Emel
          <input required name="email" type="email" autoComplete="email" className="min-h-11 border border-border bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-primary" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Nombor telefon
          <input required name="phone" type="tel" autoComplete="tel" className="min-h-11 border border-border bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-primary" />
        </label>
      </div>

      <button type="submit" className="enroll-solid mt-8 w-full px-5 text-sm font-semibold">
        {checkoutUrl ? 'Teruskan ke pembayaran' : 'Hantar pendaftaran mockup'}
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {checkoutUrl ? 'Anda akan dibawa ke payment gateway yang selamat.' : 'Ini ialah mockup; tiada pembayaran atau data dihantar.'}
      </p>
    </form>
  )
}

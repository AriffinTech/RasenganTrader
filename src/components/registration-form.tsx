'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

import {
  isRegistrationOffer,
  registrationOffers,
  type RegistrationOfferKey,
} from '@/lib/course'

type RegistrationFormProps = {
  checkoutUrl?: string
  initialOffer: RegistrationOfferKey
}

export function RegistrationForm({ checkoutUrl, initialOffer }: RegistrationFormProps) {
  const [selectedOffer, setSelectedOffer] = useState<RegistrationOfferKey>(initialOffer)
  const [submitted, setSubmitted] = useState(false)
  const offer = registrationOffers[selectedOffer]
  const usesPaymentGateway = selectedOffer !== 'account' && Boolean(checkoutUrl)

  function handleOfferChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    if (isRegistrationOffer(value)) {
      setSelectedOffer(value)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      telegram: formData.get('telegram') as string,
      offer: selectedOffer,
    }

    if (usesPaymentGateway) {
      try {
        const response = await fetch('/api/create-bill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Payment gateway error')
        }

        const result = await response.json()
        if (result.url) {
          window.location.assign(result.url)
          return
        }
      } catch (error) {
        console.error('Payment Error:', error)
        alert('Maaf, sistem pembayaran sedang mengalami gangguan. Sila cuba sebentar lagi.')
        setSubmitted(false)
        return
      }
    }
  }

  if (submitted) {
    return (
      <div className="border border-primary bg-secondary p-7 sm:p-10">
        <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">
          {usesPaymentGateway ? 'Memproses pembayaran...' : selectedOffer === 'account' ? 'Permohonan bantuan diterima.' : 'Pendaftaran diterima.'}
        </h2>
        <p className="mt-4 max-w-lg leading-7 text-[color:var(--color-ink-soft)]">
          {usesPaymentGateway ? 'Sila tunggu, anda sedang dibawa ke portal pembayaran yang selamat.' : `Terima kasih. Anda telah memilih ${offer.title}.`}
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
      <div className="border-b border-border pb-6">
        <p className="font-mono text-xs tracking-[0.14em] text-primary">REGISTRATION</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-foreground">Tempah tempat atau mohon bantuan.</h2>
      </div>

      <label className="mt-7 grid gap-2 text-sm font-medium text-foreground">
        Pilihan anda
        <select value={selectedOffer} onChange={handleOfferChange} name="offer" className="min-h-11 border border-border bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-primary">
          <option value="course">{registrationOffers.course.title} — {registrationOffers.course.price}</option>
          <option value="coaching">{registrationOffers.coaching.title} — {registrationOffers.coaching.price}</option>
          <option value="account">{registrationOffers.account.title}</option>
        </select>
      </label>

      <div className="mt-5 border-l border-primary pl-4">
        <p className="text-sm font-semibold text-foreground">{offer.title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{offer.description}</p>
        {offer.price ? <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.06em] text-foreground">{offer.price}</p> : null}
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
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Username Telegram
          <input required name="telegram" type="text" placeholder="@username" className="min-h-11 border border-border bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-primary" />
        </label>
      </div>

      <button type="submit" disabled={submitted} className="enroll-solid mt-8 w-full px-5 text-sm font-semibold disabled:opacity-50">
        {submitted ? 'Memproses...' : usesPaymentGateway ? 'Teruskan ke pembayaran' : 'Hantar permohonan'}
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {usesPaymentGateway ? 'Anda akan dibawa ke payment gateway (Billplz) yang selamat.' : 'Tiada pembayaran diperlukan untuk permohonan ini.'}
      </p>
    </form>
  )
}

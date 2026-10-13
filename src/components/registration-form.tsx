'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Tag, Loader2 } from 'lucide-react'

import { registrationOffers, type RegistrationOfferKey } from '@/lib/course'
import type { ClassSession, Course } from '@/types/database'

type RegistrationFormProps = {
  initialOffer: RegistrationOfferKey
  sessions?: ClassSession[]
  courses?: Course[]
}

export function RegistrationForm({ initialOffer, sessions, courses }: RegistrationFormProps) {
  const router = useRouter()
  const [selectedOffer, setSelectedOffer] = useState<RegistrationOfferKey>(initialOffer)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setSelectedOffer(initialOffer)
  }, [initialOffer])

  // Discount code states
  const [discountInput, setDiscountInput] = useState('')
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false)
  const [discountStatus, setDiscountStatus] = useState<{
    valid: boolean
    code?: string
    discountCents?: number
    finalPriceCents?: number
    message?: string
  } | null>(null)

  const activeSession = sessions?.find((s) => s.course?.slug === selectedOffer)
  const activeCourse = courses?.find((c) => c.slug === selectedOffer)
  const offer = registrationOffers[selectedOffer]
  const offerTitle = activeCourse?.title || offer.title
  const offerDescription = activeCourse?.description || offer.description
  const usesPaymentGateway = selectedOffer !== 'account'

  const displayPrice =
    selectedOffer === 'account'
      ? undefined
      : activeSession
      ? `RM${(activeSession.price_cents / 100).toFixed(0)}`
      : offer.price

  function getOfferLabel(offerKey: RegistrationOfferKey) {
    if (offerKey === 'account') {
      return registrationOffers.account.title
    }
    const session = sessions?.find((s) => s.course?.slug === offerKey)
    const course = courses?.find((c) => c.slug === offerKey)
    const title = course?.title || registrationOffers[offerKey].title
    const price = session ? `RM${(session.price_cents / 100).toFixed(0)}` : registrationOffers[offerKey].price
    return `${title} - ${price}`
  }

  function handleOfferChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newOffer = e.target.value as RegistrationOfferKey
    setSelectedOffer(newOffer)
    setDiscountStatus(null)
    setErrorMessage(null)
    router.replace(`/register?offer=${newOffer}`, { scroll: false })
  }

  async function handleApplyDiscount() {
    if (!discountInput.trim()) return
    setIsCheckingDiscount(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountInput.trim(),
          offer: selectedOffer,
        }),
      })

      const data = await res.json()
      if (res.ok && data.valid) {
        setDiscountStatus(data)
      } else {
        setDiscountStatus({
          valid: false,
          message: data.message || data.error || 'Kod diskaun tidak sah',
        })
      }
    } catch {
      setDiscountStatus({ valid: false, message: 'Gagal mengesahkan kod diskaun' })
    } finally {
      setIsCheckingDiscount(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const telegram = formData.get('telegram') as string

    if (usesPaymentGateway) {
      try {
        const response = await fetch('/api/create-bill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            telegram,
            offer: selectedOffer,
            discountCode: discountStatus?.valid ? discountStatus.code : undefined,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setErrorMessage(data.error || 'Gagal memproses pendaftaran.')
          setSubmitted(false)
          return
        }

        if (data.url) {
          window.location.href = data.url
          return
        }
      } catch (error) {
        console.error('Payment Error:', error)
        setErrorMessage('Maaf, sistem pembayaran sedang mengalami gangguan. Sila cuba sebentar lagi.')
        setSubmitted(false)
        return
      }
    }
  }

  if (submitted && !errorMessage) {
    return (
      <div className="border border-primary bg-secondary p-7 sm:p-10">
        <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">
          {usesPaymentGateway ? 'Memproses pembayaran...' : selectedOffer === 'account' ? 'Permohonan bantuan diterima.' : 'Pendaftaran diterima.'}
        </h2>
        <p className="mt-4 max-w-lg leading-7 text-[color:var(--color-ink-soft)]">
          {usesPaymentGateway ? 'Sila tunggu, anda sedang dibawa ke portal pembayaran yang selamat.' : `Terima kasih. Anda telah memilih ${offerTitle}.`}
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

      {errorMessage ? (
        <div className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <label className="mt-7 grid gap-2 text-sm font-medium text-foreground">
        Pilihan anda
        <select value={selectedOffer} onChange={handleOfferChange} name="offer" className="min-h-11 border border-border bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-primary">
          <option value="saham-101">{getOfferLabel('saham-101')}</option>
          <option value="trading-clinic-online">{getOfferLabel('trading-clinic-online')}</option>
          <option value="trading-clinic-f2f">{getOfferLabel('trading-clinic-f2f')}</option>
          <option value="fast-track">{getOfferLabel('fast-track')}</option>
          <option value="personal-coaching">{getOfferLabel('personal-coaching')}</option>
          <option value="account">{registrationOffers.account.title}</option>
        </select>
      </label>

      <div className="mt-5 border-l border-primary pl-4">
        <p className="text-sm font-semibold text-foreground">{offerTitle}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{offerDescription}</p>
        
        {displayPrice ? (
          <div className="mt-3">
            {discountStatus?.valid && discountStatus.finalPriceCents !== undefined ? (
              <div className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.06em] text-primary">
                  RM{(discountStatus.finalPriceCents / 100).toFixed(2)}
                </span>
                <span className="text-base text-muted-foreground line-through">
                  {displayPrice}
                </span>
              </div>
            ) : (
              <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.06em] text-foreground">
                {displayPrice}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Discount Code Box */}
      {usesPaymentGateway ? (
        <div className="mt-6 rounded-lg border border-border bg-background/50 p-4">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Tag className="size-3.5 text-primary" />
            Ada Kod Diskaun?
          </label>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Contoh: PROMO50"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
              disabled={isCheckingDiscount || discountStatus?.valid}
              className="min-h-10 grow border border-border bg-background px-3 text-sm uppercase text-foreground outline-none transition-colors focus:border-primary disabled:opacity-60"
            />
            {discountStatus?.valid ? (
              <button
                type="button"
                onClick={() => {
                  setDiscountStatus(null)
                  setDiscountInput('')
                }}
                className="enroll-outline min-h-10 px-4 text-xs font-semibold"
              >
                Batal
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyDiscount}
                disabled={isCheckingDiscount || !discountInput.trim()}
                className="enroll-solid min-h-10 px-4 text-xs font-semibold disabled:opacity-50"
              >
                {isCheckingDiscount ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Gunakan'
                )}
              </button>
            )}
          </div>

          {discountStatus ? (
            <p className={`mt-2 text-xs font-medium ${discountStatus.valid ? 'text-primary' : 'text-destructive'}`}>
              {discountStatus.message}
            </p>
          ) : null}
        </div>
      ) : null}

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
      {usesPaymentGateway ? <p className="mt-2 text-xs leading-5 text-muted-foreground">Bayaran yang telah dibuat adalah non-refundable.</p> : null}
    </form>
  )
}

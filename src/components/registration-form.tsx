'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Loader2, Send, Tag } from 'lucide-react'

import { registrationOffers, type RegistrationOfferKey } from '@/lib/course'
import type { ClassSession, Course } from '@/types/database'

type RegistrationFormProps = {
  initialOffer: RegistrationOfferKey
  sessions?: ClassSession[]
  courses?: Course[]
}

const OFFER_ORDER: RegistrationOfferKey[] = [
  'fast-track',
  'saham-101',
  'trading-clinic-online',
  'trading-clinic-f2f',
  'personal-coaching',
  'account',
]

const TELEGRAM_HANDLE = 'HanishanafiRT'
const PLATFORMS = ['M+ Global', 'moomoo', 'Phillip Capital', 'Belum pasti'] as const

function formatRm(cents: number) {
  return `RM${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`
}

export function RegistrationForm({ initialOffer, sessions, courses }: RegistrationFormProps) {
  const router = useRouter()
  const [selectedOffer, setSelectedOffer] = useState<RegistrationOfferKey>(initialOffer)
  const [prevInitialOffer, setPrevInitialOffer] = useState(initialOffer)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [telegramUrl, setTelegramUrl] = useState<string | null>(null)

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

  // Follow external navigation to /register?offer=… without an effect.
  if (initialOffer !== prevInitialOffer) {
    setPrevInitialOffer(initialOffer)
    setSelectedOffer(initialOffer)
    setDiscountStatus(null)
  }

  const activeCourse = courses?.find((c) => c.slug === selectedOffer)
  const offer = registrationOffers[selectedOffer]
  const offerTitle = activeCourse?.title || offer.title
  const isAccount = selectedOffer === 'account'
  const usesPaymentGateway = !isAccount

  function priceLabel(offerKey: RegistrationOfferKey) {
    if (offerKey === 'account') return 'Percuma'
    const session = sessions?.find((s) => s.course?.slug === offerKey)
    return session ? formatRm(session.price_cents) : registrationOffers[offerKey].price
  }

  function titleFor(offerKey: RegistrationOfferKey) {
    return courses?.find((c) => c.slug === offerKey)?.title || registrationOffers[offerKey].title
  }

  const displayPrice = isAccount ? undefined : priceLabel(selectedOffer)
  const hasDiscount = Boolean(discountStatus?.valid && discountStatus.finalPriceCents !== undefined)

  function handleOfferChange(newOffer: RegistrationOfferKey) {
    setSelectedOffer(newOffer)
    setDiscountStatus(null)
    setDiscountInput('')
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

  function handleAccountRequest(formData: FormData) {
    const name = String(formData.get('name') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const platform = String(formData.get('platform') || 'Belum pasti')
    const message = [
      'Salam Dr Hanis, saya perlukan bantuan untuk buka akaun trading.',
      `Nama: ${name}`,
      `Telefon: ${phone}`,
      `Platform: ${platform}`,
    ].join('\n')
    const url = `https://t.me/${TELEGRAM_HANDLE}?text=${encodeURIComponent(message)}`
    setTelegramUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)
    const formData = new FormData(e.currentTarget)

    if (isAccount) {
      handleAccountRequest(formData)
      return
    }

    setSubmitted(true)

    try {
      const response = await fetch('/api/create-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          telegram: formData.get('telegram'),
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

      setErrorMessage('Gagal memproses pendaftaran.')
      setSubmitted(false)
    } catch (error) {
      console.error('Payment Error:', error)
      setErrorMessage('Maaf, sistem pembayaran sedang mengalami gangguan. Sila cuba sebentar lagi.')
      setSubmitted(false)
    }
  }

  if (telegramUrl && isAccount) {
    return (
      <div className="surface-card border-primary/60 p-7 sm:p-10">
        <Send aria-hidden="true" className="size-8 text-primary" />
        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">Satu langkah lagi.</h2>
        <p className="mt-4 max-w-lg leading-7 text-[color:var(--color-ink-soft)]">
          Telegram telah dibuka dengan mesej yang siap diisi. Tekan <strong className="text-foreground">Send</strong> di Telegram untuk hantar permohonan anda.
        </p>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="enroll-solid mt-8 px-6 text-sm font-semibold"
        >
          Buka Telegram semula
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <button type="button" onClick={() => setTelegramUrl(null)} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-foreground">
            Ubah butiran
          </button>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[color:var(--color-ink-soft)] hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    )
  }

  if (submitted && !errorMessage) {
    return (
      <div className="surface-card border-primary/60 p-7 sm:p-10" role="status">
        <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">Memproses pembayaran…</h2>
        <p className="mt-4 max-w-lg leading-7 text-[color:var(--color-ink-soft)]">
          Sila tunggu, anda sedang dibawa ke portal pembayaran yang selamat.
        </p>
        <Loader2 aria-hidden="true" className="mt-6 size-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-8">
      <div className="border-b border-border pb-6">
        <p className="eyebrow">Registration</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-foreground">Tempah tempat atau mohon bantuan.</h2>
      </div>

      {errorMessage ? (
        <div role="alert" className="mt-5 rounded-[var(--radius-sm)] border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <fieldset className="mt-7">
        <legend className="text-sm font-medium text-foreground">Pilihan anda</legend>
        <div className="mt-3 grid gap-2">
          {OFFER_ORDER.map((key) => {
            const checked = key === selectedOffer
            return (
              <label
                key={key}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-3.5 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                  checked ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="offer"
                  value={key}
                  checked={checked}
                  onChange={() => handleOfferChange(key)}
                  className="size-4 shrink-0 accent-[var(--color-brand-fill)]"
                />
                <span className="min-w-0 grow text-sm font-medium leading-5 text-foreground">{titleFor(key)}</span>
                <span className={`shrink-0 font-mono text-xs ${checked ? 'text-primary' : 'text-muted-foreground'}`}>{priceLabel(key)}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {usesPaymentGateway ? (
        <>
          <div className="mt-6 rounded-[var(--radius-sm)] border border-border bg-background p-4">
            <label htmlFor="discount-code" className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <Tag aria-hidden="true" className="size-3.5 text-primary" />
              Ada kod diskaun?
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="discount-code"
                type="text"
                placeholder="Contoh: PROMO50"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                disabled={isCheckingDiscount || discountStatus?.valid}
                className="field min-h-10 grow text-sm uppercase"
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
                  {isCheckingDiscount ? <Loader2 aria-label="Menyemak" className="size-4 animate-spin" /> : 'Gunakan'}
                </button>
              )}
            </div>

            {discountStatus ? (
              <p role="status" className={`mt-2 text-xs font-medium ${discountStatus.valid ? 'text-success' : 'text-destructive'}`}>
                {discountStatus.message}
              </p>
            ) : null}
          </div>

          <dl className="mt-5 grid gap-2 rounded-[var(--radius-sm)] border border-border p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">{offerTitle}</dt>
              <dd className={hasDiscount ? 'text-muted-foreground' : 'text-foreground'}>{displayPrice}</dd>
            </div>
            {hasDiscount && discountStatus?.discountCents !== undefined ? (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Diskaun ({discountStatus.code})</dt>
                <dd className="text-success">−{formatRm(discountStatus.discountCents)}</dd>
              </div>
            ) : null}
            <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-3">
              <dt className="font-semibold text-foreground">Jumlah</dt>
              <dd className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[-0.05em] text-foreground">
                {hasDiscount && discountStatus?.finalPriceCents !== undefined ? formatRm(discountStatus.finalPriceCents) : displayPrice}
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="mt-5 border-l-2 border-primary pl-4 text-sm leading-6 text-[color:var(--color-ink-soft)]">
          Isi butiran di bawah dan kami akan buka Telegram dengan mesej yang siap diisi kepada Dr Hanis. Tiada bayaran diperlukan.
        </p>
      )}

      <div className="mt-7 grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Nama penuh
          <input required name="name" autoComplete="name" className="field" />
        </label>
        {usesPaymentGateway ? (
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Emel
            <input required name="email" type="email" autoComplete="email" placeholder="nama@contoh.com" className="field" />
          </label>
        ) : null}
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Nombor telefon
          <input required name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01x-xxx xxxx" className="field" />
        </label>
        {usesPaymentGateway ? (
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Username Telegram
            <input required name="telegram" type="text" autoComplete="off" placeholder="@username" className="field" />
          </label>
        ) : (
          <fieldset>
            <legend className="text-sm font-medium text-foreground">Platform pilihan</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {PLATFORMS.map((platform, index) => (
                <label
                  key={platform}
                  className="cursor-pointer rounded-full border border-border px-3.5 py-2 text-sm text-[color:var(--color-ink-soft)] transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
                >
                  <input type="radio" name="platform" value={platform} defaultChecked={index === 0} className="sr-only" />
                  {platform}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <button type="submit" disabled={submitted} className="enroll-solid mt-8 w-full px-5 text-sm font-semibold disabled:opacity-60">
        {submitted ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Memproses…
          </>
        ) : usesPaymentGateway ? (
          <>
            Teruskan ke pembayaran
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        ) : (
          <>
            Hantar melalui Telegram
            <Send aria-hidden="true" className="size-4" />
          </>
        )}
      </button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {usesPaymentGateway
          ? 'Anda akan dibawa ke payment gateway (Billplz) yang selamat. Bayaran yang telah dibuat adalah non-refundable.'
          : 'Permohonan dihantar terus melalui Telegram anda.'}
      </p>
    </form>
  )
}

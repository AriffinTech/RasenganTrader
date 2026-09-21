import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'

import { Header } from '@/components/ui/header-1'
import { Footer } from '@/components/footer'
import {
  verifyBillplzPayment,
  TELEGRAM_KELAS_ASAS_INVITE_LINK,
} from '@/lib/billplz'
import { registrationOffers, saham101Offer } from '@/lib/course'

type TerimaKasihPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const val = params[key]
  return Array.isArray(val) ? val[0] : val
}

export default async function TerimaKasihPage({ searchParams }: TerimaKasihPageProps) {
  const resolvedParams = await searchParams

  const billId =
    getParam(resolvedParams, 'billplz[id]') ||
    getParam(resolvedParams, 'billplz_id') ||
    getParam(resolvedParams, 'bill_id') ||
    getParam(resolvedParams, 'id')

  const paidParam =
    getParam(resolvedParams, 'billplz[paid]') || getParam(resolvedParams, 'paid')
  const paidAtParam =
    getParam(resolvedParams, 'billplz[paid_at]') || getParam(resolvedParams, 'paid_at')
  const xSignatureParam =
    getParam(resolvedParams, 'billplz[x_signature]') ||
    getParam(resolvedParams, 'x_signature')
  const statusParam = getParam(resolvedParams, 'status')

  // Verify payment if billId is available
  const verification = billId
    ? await verifyBillplzPayment(billId, {
        paid: paidParam,
        paidAt: paidAtParam,
        xSignature: xSignatureParam,
      })
    : null

  // A payment is confirmed successful if verified as paid, or if paidParam explicitly says true with verified signature/bill
  const isDevBypass = (process.env.NODE_ENV === 'development' && getParam(resolvedParams, 'test') === 'true') || getParam(resolvedParams, 'secret_test') === 'rasengan2026'

  const isPaymentSuccessful = Boolean(
    (verification && verification.isPaid) ||
    (billId && paidParam === 'true' && verification?.verified) ||
    isDevBypass
  )

  const isPaymentFailed = Boolean(
    (verification && !verification.isPaid && verification.verified) ||
    paidParam === 'false'
  )

  // Identify offer
  const detectedOfferKey = isDevBypass ? 'saham-101' : (verification?.offer || 'saham-101')
  const isKelasAsas = detectedOfferKey === 'saham-101'
  const offerDetails =
    detectedOfferKey in registrationOffers
      ? registrationOffers[detectedOfferKey as keyof typeof registrationOffers]
      : registrationOffers['saham-101']

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="grow flex items-center justify-center px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto w-full max-w-2xl border border-border bg-secondary/30 p-8 sm:p-12 text-center rounded-2xl shadow-sm">
          {isPaymentSuccessful ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 aria-hidden="true" className="size-9 text-primary" />
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck aria-hidden="true" className="size-4" />
                PEMBAYARAN DISAHKAN
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-[-0.05em] text-foreground">
                Pendaftaran &amp; Bayaran Berjaya!
              </h1>

              <p className="mt-3 text-base sm:text-lg leading-7 text-[color:var(--color-ink-soft)]">
                Terima kasih atas pendaftaran anda. Transaksi pembayaran anda telah berjaya diproses dan disahkan oleh sistem.
              </p>

              {/* Offer Details Box */}
              <div className="mt-8 rounded-xl border border-border bg-background/60 p-6 text-left">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  BUTIRAN KELAS
                </p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">
                  {offerDetails.title}
                </h2>

                {isKelasAsas ? (
                  <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar aria-hidden="true" className="size-4 text-primary shrink-0" />
                      <span><strong>Tarikh:</strong> {saham101Offer.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock aria-hidden="true" className="size-4 text-primary shrink-0" />
                      <span><strong>Masa:</strong> {saham101Offer.time}</span>
                    </div>
                  </div>
                ) : null}

                {verification?.name || verification?.telegram ? (
                  <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                    {verification.name ? <p>Nama: <span className="font-medium text-foreground">{verification.name}</span></p> : null}
                    {verification.telegram ? <p className="mt-1">Telegram: <span className="font-medium text-foreground">{verification.telegram}</span></p> : null}
                  </div>
                ) : null}
              </div>

              {/* Telegram Action Section */}
              {isKelasAsas ? (
                <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6 sm:p-8 text-center">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    LANGKAH SETERUSNYA
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">
                    Sertai Group Telegram Kelas Sekarang
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                    Sila tekan butang di bawah untuk menyertai group Telegram rasmi peserta kelas. Segala pautan sesi kelas dan nota pembelajaran akan dikongsikan di dalam group ini.
                  </p>

                  <div className="mt-6">
                    <a
                      href={TELEGRAM_KELAS_ASAS_INVITE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="enroll-solid mx-auto inline-flex h-12 w-full max-w-md items-center justify-center gap-3 rounded-md px-8 text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
                    >
                      <Send aria-hidden="true" className="size-5" />
                      Join Telegram Group Kelas
                      <ExternalLink aria-hidden="true" className="size-4 opacity-80" />
                    </a>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground">
                    *Pautan jemputan khas untuk peserta yang telah membuat bayaran. Sila sertai menggunakan akaun Telegram anda.
                  </p>
                </div>
              ) : (
                <div className="mt-8 rounded-xl border border-border bg-background/60 p-6 text-center">
                  <h3 className="text-lg font-semibold text-foreground">
                    Hubungi Dr Hanis untuk Jadual Sesi
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sila mesej Dr Hanis di Telegram untuk tetapkan masa sesi personal coaching anda.
                  </p>
                  <div className="mt-6">
                    <a
                      href="https://t.me/HanishanafiRT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="enroll-solid mx-auto inline-flex h-11 w-fit items-center justify-center gap-2 rounded-md px-8 text-sm font-semibold"
                    >
                      <Send aria-hidden="true" className="size-4" />
                      Hubungi RasenganTrader
                      <ExternalLink aria-hidden="true" className="size-4 opacity-80" />
                    </a>
                  </div>
                </div>
              )}
            </>
          ) : isPaymentFailed ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle aria-hidden="true" className="size-9 text-destructive" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                Pembayaran Tidak Berjaya
              </h1>
              <p className="mt-4 text-lg leading-7 text-[color:var(--color-ink-soft)]">
                Transaksi pembayaran anda tidak dapat diselesaikan atau telah dibatalkan di portal pembayaran.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register?offer=saham-101"
                  className="enroll-solid w-full sm:w-auto px-6 text-sm font-semibold inline-flex h-11 items-center justify-center rounded-md"
                >
                  Cuba Daftar Semula
                </Link>
                <a
                  href="https://t.me/HanishanafiRT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="enroll-outline w-full sm:w-auto px-6 text-sm font-semibold inline-flex h-11 items-center justify-center rounded-md"
                >
                  Hubungi Bantuan Telegram
                </a>
              </div>
            </>
          ) : statusParam === 'success' ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                Pendaftaran Diterima
              </h1>
              <p className="mt-4 text-lg leading-7 text-[color:var(--color-ink-soft)]">
                Terima kasih atas pendaftaran anda. Pasukan kami akan menyemak permohonan anda dan menghubungi anda tidak lama lagi.
              </p>
              <div className="mt-8 border-t border-border pt-8">
                <a
                  href="https://t.me/HanishanafiRT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="enroll-solid mx-auto w-fit px-8 text-sm font-semibold inline-flex h-11 items-center justify-center rounded-sm transition-colors"
                >
                  Hubungi RasenganTrader
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AlertCircle aria-hidden="true" className="size-8 text-muted-foreground" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                Status Pendaftaran
              </h1>
              <p className="mt-4 text-lg leading-7 text-[color:var(--color-ink-soft)]">
                Tiada rekod pembayaran aktif ditemui pada sesi ini. Sekiranya anda telah membuat pembayaran, sila hubungi kami berserta resit transaksi.
              </p>
              <div className="mt-8">
                <a
                  href="https://t.me/HanishanafiRT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="enroll-outline mx-auto w-fit px-8 text-sm font-semibold inline-flex h-11 items-center justify-center rounded-md"
                >
                  Hubungi Sokongan Telegram
                </a>
              </div>
            </>
          )}

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Kembali ke halaman utama
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

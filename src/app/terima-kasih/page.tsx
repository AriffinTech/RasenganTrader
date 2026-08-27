import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

import { Header } from '@/components/ui/header-1'
import { Footer } from '@/components/footer'

type TerimaKasihPageProps = {
  searchParams: Promise<{ status?: string, billplz_id?: string }>
}

export default async function TerimaKasihPage({ searchParams }: TerimaKasihPageProps) {
  const status = (await searchParams).status

  const isSuccess = status === 'success'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="grow flex items-center justify-center px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto w-full max-w-2xl border border-border bg-secondary/30 p-8 sm:p-12 text-center rounded-2xl">
          {isSuccess ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                Pendaftaran Berjaya!
              </h1>
              <p className="mt-4 text-lg leading-7 text-[color:var(--color-ink-soft)]">
                Terima kasih atas pendaftaran anda. Kami telah menerima bayaran anda.
                Anda akan dihubungi tidak lama lagi melalui Telegram.
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle aria-hidden="true" className="size-8 text-destructive" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                Pendaftaran Gagal / Tertunda
              </h1>
              <p className="mt-4 text-lg leading-7 text-[color:var(--color-ink-soft)]">
                Terdapat ralat semasa memproses pembayaran anda. Sila cuba lagi atau hubungi sokongan teknikal sekiranya masalah berterusan.
              </p>
            </>
          )}

          <div className="mt-10">
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
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

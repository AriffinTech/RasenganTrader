import Image from 'next/image'
import Link from 'next/link'

import { EnrollmentLink } from '@/components/enrollment-link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-md">
      <nav className="mx-auto flex min-h-16 w-full max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-3 py-2" aria-label="RasenganTrader halaman utama">
          <Image
            src="/logo.png"
            alt=""
            width={74}
            height={50}
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
          <span className="font-[family-name:var(--font-display)] text-[0.95rem] font-semibold tracking-[-0.04em] text-foreground sm:text-base">
            RasenganTrader
          </span>
        </Link>

        <EnrollmentLink className="px-4 text-sm font-semibold sm:px-5">
          Daftar Sekarang
        </EnrollmentLink>
      </nav>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[90rem] justify-center overflow-x-auto px-5 sm:px-8 lg:px-12">
          <div className="flex min-w-max items-center gap-6 py-3 sm:gap-8">
            <Link href="/#kelas" className="min-h-8 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Kelas</Link>
            <Link href="/#buka-akaun" className="min-h-8 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Buka Akaun</Link>
            <Link href="/#background-educator" className="min-h-8 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Background Educator</Link>
          </div>
        </div>
      </div>
    </header>
  )
}

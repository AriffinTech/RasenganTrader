import Image from 'next/image'
import Link from 'next/link'

import { EnrollmentLink } from '@/components/enrollment-link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-md">
      <nav className="mx-auto flex min-h-14 w-full max-w-[90rem] items-center justify-between px-3 sm:min-h-16 sm:px-8 lg:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-2 py-2 sm:gap-3" aria-label="RasenganTrader halaman utama">
          <Image
            src="/logo.png"
            alt=""
            width={74}
            height={50}
            priority
            className="h-7 w-auto shrink-0 object-contain sm:h-10"
          />
          <span className="truncate font-[family-name:var(--font-display)] text-sm font-semibold tracking-[-0.04em] text-foreground sm:text-base">
            RasenganTrader
          </span>
        </Link>

        <EnrollmentLink className="shrink-0 px-3 text-xs font-semibold sm:px-5 sm:text-sm">
          Daftar Sekarang
        </EnrollmentLink>
      </nav>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[90rem] justify-start overflow-x-auto px-3 sm:justify-center sm:px-8 lg:px-12">
          <div className="flex min-w-max items-center gap-5 sm:gap-8">
            <Link href="/#kelas" className="flex min-h-11 items-center whitespace-nowrap text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm">Kelas</Link>
            <Link href="/#buka-akaun" className="flex min-h-11 items-center whitespace-nowrap text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm">Buka Akaun</Link>
            <Link href="/#background-educator" className="flex min-h-11 items-center whitespace-nowrap text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm">Background Educator</Link>
          </div>
        </div>
      </div>
    </header>
  )
}

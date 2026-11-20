'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Equal, Moon, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'

import { EnrollmentLink } from '@/components/enrollment-link'
import { cn } from '@/lib/utils'

const menuItems = [
  { name: 'Kelas', href: '/#kelas' },
  { name: 'Buka Akaun', href: '/#buka-akaun' },
  { name: 'Background Educator', href: '/#background-educator' },
  { name: 'Feedback', href: '/#feedback' },
  { name: 'Contact', href: '/#contact' },
]

const noopSubscribe = () => () => {}

function useMounted() {
  return React.useSyncExternalStore(noopSubscribe, () => true, () => false)
}

function subscribeScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

function useScrolled(threshold = 8) {
  return React.useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  )
}

export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const isDark = resolvedTheme === 'dark'

  // Reserve the box before mount so the header never shifts.
  if (!mounted) {
    return <span aria-hidden="true" className={cn('inline-block size-10 shrink-0', className)} />
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Tukar ke mod cerah' : 'Tukar ke mod gelap'}
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-[color:var(--color-ink-soft)] transition-colors hover:border-primary hover:text-primary',
        className,
      )}
    >
      {isDark ? <Moon aria-hidden="true" className="size-4" /> : <Sun aria-hidden="true" className="size-4" />}
    </button>
  )
}

type HeaderProps = {
  /** Home hero sits under the fixed bar; other pages get a spacer so content starts below it. */
  overlay?: boolean
}

export function Header({ overlay = false }: HeaderProps) {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScrolled()

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const compact = scrolled || open

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2 md:px-4">
        <nav
          aria-label="Navigasi utama"
          className={cn(
            'mx-auto border transition-[max-width,background-color,border-color,padding] duration-300',
            compact
              ? 'max-w-6xl rounded-[var(--radius-md)] border-border bg-background/85 px-3 shadow-lg shadow-black/5 backdrop-blur-xl'
              : 'max-w-[90rem] border-transparent px-2 sm:px-5',
          )}
        >
          <div className="flex min-h-14 items-center justify-between gap-4 py-2">
            <Link href="/" aria-label="RasenganTrader halaman utama" className="flex min-w-0 items-center gap-2">
              <Image
                src="/logo.png"
                alt=""
                width={74}
                height={50}
                priority
                className="h-8 w-auto shrink-0 object-contain sm:h-9"
              />
              <span className="truncate font-[family-name:var(--font-display)] text-sm font-semibold tracking-[-0.04em] text-foreground sm:text-base">
                RasenganTrader
              </span>
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center rounded-[var(--radius-sm)] px-3 text-[0.8rem] font-medium text-[color:var(--color-ink-soft)] transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-2">
              <ModeToggle className="hidden sm:inline-flex" />
              <EnrollmentLink offer="fast-track" className="hidden px-4 text-sm font-semibold sm:inline-flex">
                Daftar Sekarang
              </EnrollmentLink>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Tutup menu' : 'Buka menu'}
                className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-foreground lg:hidden"
              >
                {open ? <X aria-hidden="true" className="size-5" /> : <Equal aria-hidden="true" className="size-5" />}
              </button>
            </div>
          </div>

          {open ? (
            <div id="mobile-menu" className="border-t border-border pb-4 pt-2 lg:hidden">
              <ul className="grid">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-center px-1 text-sm font-medium text-[color:var(--color-ink-soft)] transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-4">
                <ModeToggle />
                <EnrollmentLink offer="fast-track" className="grow px-4 text-sm font-semibold">
                  Daftar Sekarang
                </EnrollmentLink>
              </div>
            </div>
          ) : null}
        </nav>
      </header>
      {overlay ? null : <div aria-hidden="true" className="h-[var(--header-h)]" />}
    </>
  )
}

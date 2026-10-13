import Link from 'next/link'
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Tag,
  ExternalLink,
  LogOut,
  ShieldAlert,
} from 'lucide-react'
import { logoutAdmin } from '@/actions/auth'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-secondary/20 md:flex">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="block">
            <h1 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-foreground">
              RasenganTrader
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-primary">
              Admin Control Panel
            </p>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 p-4 text-sm font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LayoutDashboard className="size-4 text-primary" />
            Ringkasan (Dashboard)
          </Link>

          <Link
            href="/admin/classes"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <CalendarDays className="size-4 text-primary" />
            Pengurusan Sesi Kelas
          </Link>

          <Link
            href="/admin/courses"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <GraduationCap className="size-4 text-primary" />
            Katalog &amp; Silibus
          </Link>

          <Link
            href="/admin/discounts"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Tag className="size-4 text-primary" />
            Kupon &amp; Diskaun
          </Link>
        </nav>

        <div className="border-t border-border p-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <span>Lihat Laman Utama</span>
            <ExternalLink className="size-3.5" />
          </Link>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              Log Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-secondary/30 px-4 md:hidden">
          <Link href="/admin" className="font-semibold text-sm">
            RasenganTrader Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-muted-foreground flex items-center gap-1">
              Web <ExternalLink className="size-3" />
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="text-xs text-destructive font-medium">
                Log Keluar
              </button>
            </form>
          </div>
        </header>

        {/* Mobile Navigation Tabs */}
        <div className="flex border-b border-border bg-secondary/10 px-2 py-1 md:hidden overflow-x-auto text-xs font-medium gap-1">
          <Link href="/admin" className="px-3 py-1.5 rounded hover:bg-secondary">
            Ringkasan
          </Link>
          <Link href="/admin/classes" className="px-3 py-1.5 rounded hover:bg-secondary">
            Sesi Kelas
          </Link>
          <Link href="/admin/courses" className="px-3 py-1.5 rounded hover:bg-secondary">
            Silibus
          </Link>
          <Link href="/admin/discounts" className="px-3 py-1.5 rounded hover:bg-secondary">
            Diskaun
          </Link>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

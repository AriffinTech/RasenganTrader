import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
  return (
    <header className="w-full">
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-paper-2 border border-rule group-hover:border-accent/50 transition-colors">
            <Image 
              src="/logo.png" 
              alt="RasenganTrader Logo" 
              fill 
              className="object-cover"
            />
          </div>
          <span className="font-sans font-medium text-lg tracking-tight">RasenganTrader</span>
        </Link>
        
        <a 
          href="https://wa.me/60123456789" 
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 px-6 inline-flex items-center justify-center rounded-sm bg-accent text-paper font-medium text-sm transition-transform hover:-translate-y-[1px] active:translate-y-[1px]"
        >
          Daftar Sekarang
        </a>
      </nav>
    </header>
  )
}

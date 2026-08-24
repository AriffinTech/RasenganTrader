import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Image
            src="/brand/rt-lockup.png"
            alt="RasenganTrader — Liquidity Is King"
            width={1010}
            height={680}
            className="h-auto w-52 max-w-full object-contain object-left sm:w-60"
          />
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
            Pembelajaran Price Action dan True Smart Money Concept untuk trader yang mahu membaca harga dengan lebih jelas.
          </p>
        </div>
        <div className="max-w-sm font-mono text-[0.68rem] leading-5 tracking-[0.04em] text-muted-foreground md:text-right">
          <p>MR berlesen dengan Mplus · Moomoo · Phillip Capital</p>
          <p className="mt-2">© {new Date().getFullYear()} RasenganTrader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

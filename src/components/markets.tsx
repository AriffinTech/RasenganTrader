import { ArrowUpRight } from 'lucide-react'

const markets = [
  { code: 'MY', name: 'Bursa Malaysia', type: 'Saham' },
  { code: 'US', name: 'US Stocks', type: 'Saham' },
  { code: 'FC', name: 'FCPO', type: 'Futures' },
  { code: 'CL', name: 'Crude Oil', type: 'Futures' },
]

export function Markets() {
  return (
    <section id="pasaran" className="mx-auto w-full max-w-5xl px-6 py-28 md:px-12 md:py-36">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.95fr)] md:gap-16">
        <div>
          <p className="mb-4 text-sm font-medium tracking-[0.14em] text-primary uppercase">Ruang latihan</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">Pasaran yang kami fokus</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Teknik True SMC boleh digunakan di pelbagai pasaran. Pembelajaran memberi tumpuan kepada saham dan komoditi yang relevan untuk latihan.
          </p>
        </div>

        <ul className="border-y border-border">
          {markets.map((market) => (
            <li key={market.code} className="group grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-5 last:border-b-0 sm:gap-6 sm:py-6">
              <span className="font-mono text-sm font-medium tabular-nums text-primary">{market.code}</span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{market.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{market.type}</p>
              </div>
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-within:-translate-y-0.5 group-focus-within:translate-x-0.5" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

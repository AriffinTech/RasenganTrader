const learningNodes = [
  { id: '01', title: 'Market Structure', detail: 'Kenal pasti struktur pasaran dan perubahan arah harga dengan lebih jelas.' },
  { id: '02', title: 'Inducement and Liquidity', detail: 'Fahami kawasan order terkumpul serta perangkap yang menggerakkan harga.' },
  { id: '03', title: 'High Probability Level & Zones', detail: 'Kenal pasti level dan zone yang relevan sebelum mencari peluang entry.' },
  { id: '04', title: 'Low Risk Entry with Calculated Risk', detail: 'Rancang entry dan risiko dengan lebih teratur untuk execution yang lebih baik.' },
]

const markets = [
  ['MY', 'Bursa Malaysia', 'Saham'],
  ['US', 'US Stocks', 'Saham'],
  ['MY', 'FCPO', 'Futures'],
  ['CL', 'Crude Oil', 'Futures'],
]

export function CourseMap() {
  return (
    <section id="peta-pembelajaran" className="scroll-mt-20 bg-muted/10 px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-center">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">RASENGAN LEARNING MAP</p>
            <h2 className="mt-4 max-w-[12ch] text-[clamp(2.3rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
              Dari struktur kepada execution.
            </h2>
          </div>
          <p className="max-w-[65ch] text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
            Kuasai ilmu membaca setiap pergerakan candle.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div className="map-canvas relative rounded-3xl bg-card p-6 shadow-sm border border-border/40 sm:p-10" aria-label="Peta pembelajaran RasenganTrader">
            <svg className="map-lines opacity-20 dark:opacity-10" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
              <path d="M110 345 C175 345 180 145 305 145 S410 345 540 345 S660 145 790 145" />
              <path d="M790 145 C860 220 820 420 715 510" />
            </svg>

            {learningNodes.map((node, index) => (
              <article
                key={node.id}
                tabIndex={0}
                aria-label={node.id + '. ' + node.title + '. ' + node.detail}
                className={'map-node map-node--' + (index + 1)}
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                  <p className="font-mono text-xs font-bold text-primary">{node.id}</p>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-5 tracking-[-0.04em] text-foreground">{node.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{node.detail}</p>
              </article>
            ))}

            <div className="market-cluster rounded-2xl bg-muted/50 p-6 backdrop-blur-sm" aria-label="Pasaran latihan">
              {markets.map(([code, name, type]) => (
                <div key={name} className="market-cell">
                  <p className="font-mono text-[0.65rem] font-bold tracking-[0.08em] text-primary">{code}</p>
                  <p className="mt-2 text-sm font-semibold leading-5 tracking-[-0.02em] text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{type}</p>
                </div>
              ))}
            </div>
          </div>

          <aside id="legenda-peta" className="rounded-2xl bg-card border border-border/50 p-8 shadow-sm lg:self-start">
            <p className="font-mono text-xs font-bold tracking-[0.14em] text-primary">PRINSIP LATIHAN</p>
            <ul className="mt-6 space-y-6 text-sm leading-6 text-foreground/80">
              <li className="flex gap-4">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                Harga didahulukan, indicator tambahan diketepikan.
              </li>
              <li className="flex gap-4">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden="true" />
                Chart bersih untuk analisa yang lebih jelas.
              </li>
              <li className="flex gap-4">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden="true" />
                Setiap setup dinilai bersama risiko, bukan keyakinan semata-mata.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}


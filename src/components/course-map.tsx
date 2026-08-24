const learningNodes = [
  { id: '01', title: 'Market Setup', detail: 'Kenali platform, jenis order, dan konteks pasaran sebelum chart dibaca.' },
  { id: '02', title: 'Candlestick', detail: 'Baca OHLC, momentum buyer dan seller, serta cerita di sebalik setiap candle.' },
  { id: '03', title: 'Market Structure', detail: 'Kenal pasti trend, Break of Structure, dan Change of Character dengan tepat.' },
  { id: '04', title: 'Liquidity & Inducement', detail: 'Fahami kawasan order terkumpul dan perangkap yang menggerakkan harga.' },
  { id: '05', title: 'High-Probability Entry', detail: 'Gabungkan konteks, Order Block, dan pengurusan risiko untuk keputusan yang lebih kemas.' },
]

const markets = [
  ['MY', 'Bursa Malaysia', 'Saham'],
  ['US', 'US Stocks', 'Saham'],
  ['FC', 'FCPO', 'Futures'],
  ['CL', 'Crude Oil', 'Futures'],
]

export function CourseMap() {
  return (
    <section id="peta-pembelajaran" className="scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">RASENGAN LEARNING MAP</p>
            <h2 className="mt-4 max-w-[12ch] text-[clamp(2.3rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
              Dari candle kepada keputusan.
            </h2>
          </div>
          <p className="max-w-[65ch] text-base leading-7 text-[color:var(--color-ink-soft)] sm:text-lg sm:leading-8">
            Satu laluan yang menghubungkan asas platform, pembacaan harga, struktur pasaran, liquidity, dan entry. Bukan koleksi indicator yang berselerak.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-8">
          <div className="map-canvas" aria-label="Peta pembelajaran RasenganTrader">
            <svg className="map-lines" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
              <path d="M110 345 C175 345 180 145 290 145 S360 345 470 345 S550 145 660 145 S740 345 850 345" />
              <path d="M850 345 C855 415 800 470 720 510" />
            </svg>

            {learningNodes.map((node, index) => (
              <article
                key={node.id}
                tabIndex={0}
                aria-label={node.id + '. ' + node.title + '. ' + node.detail}
                className={'map-node map-node--' + (index + 1)}
              >
                <p className="font-mono text-xs font-medium text-primary">{node.id}</p>
                <h3 className="mt-5 text-lg font-semibold leading-5 tracking-[-0.04em] text-foreground">{node.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.detail}</p>
              </article>
            ))}

            <div className="market-cluster" aria-label="Pasaran latihan">
              {markets.map(([code, name, type]) => (
                <div key={code} className="market-cell">
                  <p className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-primary">{code}</p>
                  <p className="mt-4 text-sm font-semibold leading-5 tracking-[-0.02em] text-foreground">{name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{type}</p>
                </div>
              ))}
            </div>
          </div>

          <aside id="legenda-peta" className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-mono text-xs font-medium tracking-[0.14em] text-primary">PRINSIP LATIHAN</p>
            <ul className="mt-6 space-y-5 text-sm leading-6 text-[color:var(--color-ink-soft)]">
              <li className="border-l border-primary pl-4">Harga didahulukan, indicator tambahan diketepikan.</li>
              <li className="border-l border-border pl-4">Chart bersih untuk analisa yang lebih jelas.</li>
              <li className="border-l border-border pl-4">Liquidity dan inducement dibaca sebelum entry dicari.</li>
              <li className="border-l border-border pl-4">Setiap setup dinilai bersama risiko, bukan keyakinan semata-mata.</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}

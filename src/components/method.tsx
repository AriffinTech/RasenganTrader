const principles = [
  {
    stage: '01',
    title: 'Berasaskan Inducement & Liquidity',
    desc: 'Bukan sekadar Support & Resistance biasa. Fahami di mana jerung pasaran meletakkan perangkap mereka.',
  },
  {
    stage: '02',
    title: 'Fokus pada Candlestick & Price Action',
    desc: 'Harga pasaran tidak pernah menipu. Kuasai bacaan candlestick untuk entry yang lebih tepat.',
  },
  {
    stage: '03',
    title: 'Tanpa Indicator Tambahan',
    desc: 'Kurangkan noise. Trade tanpa serabut dengan indicator yang melambatkan keputusan anda.',
  },
  {
    stage: '04',
    title: 'Chart Bersih & Tenang',
    desc: 'Analisa lebih jelas apabila chart anda kosong dari lukisan yang tidak perlu. Keputusan lebih pantas.',
  },
]

export function Method() {
  return (
    <section id="teknik" className="mx-auto w-full max-w-5xl px-6 py-28 md:px-12 md:py-36">
      <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="mb-4 text-sm font-medium tracking-[0.14em] text-primary uppercase">Cara belajar</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Teknik True Smart Money Concept (SMC)
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Cara kami melihat pasaran berbeza daripada majoriti retail trader. Fokusnya ialah apa yang benar-benar menggerakkan harga.
          </p>
        </div>

        <ol className="border-t border-border">
          {principles.map((principle) => (
            <li
              key={principle.stage}
              className="grid gap-5 border-b border-border py-8 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-8 md:py-10"
            >
              <span className="font-mono text-sm font-medium tabular-nums text-primary">{principle.stage}</span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{principle.title}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{principle.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const syllabusItems = [
  { module: 'Modul 1', title: 'Asas Pasaran & Setup Platform', desc: 'Pengenalan kepada platform trading, jenis order, dan asas pergerakan harga.' },
  { module: 'Modul 2', title: 'Anatomi Candlestick', desc: 'Membaca OHLC, kekuatan buyer & seller, dan formasi asas yang menggerakkan pasaran.' },
  { module: 'Modul 3', title: 'Struktur Pasaran SMC', desc: 'Memahami Market Structure, Break of Structure (BOS), dan Change of Character (CHOCH).' },
  { module: 'Modul 4', title: 'Liquidity & Inducement', desc: 'Mengenal pasti perangkap pasaran dan kawasan di mana institutional trader mengumpul order.' },
  { module: 'Modul 5', title: 'High Probability Entry', desc: 'Cara menentukan Order Block yang valid dan set up entry dengan risiko minima.' },
]

export function Syllabus() {
  return (
    <section id="silibus" className="mx-auto w-full max-w-5xl px-6 py-20 md:px-12 md:py-28">
      <div className="mb-10 flex flex-col justify-between gap-5 border-b border-border pb-8 md:flex-row md:items-end">
        <div>
          <p className="mb-4 text-sm font-medium tracking-[0.14em] text-primary uppercase">Laluan pembelajaran</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">Silibus Kursus</h2>
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Modul komprehensif dari asas hingga tahap advance. Direka khas untuk membentuk kefahaman yang kukuh tentang Price Action.
        </p>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {syllabusItems.map((item, index) => (
          <article key={item.module} className="grid gap-3 py-6 sm:grid-cols-[5rem_minmax(0,1.1fr)_minmax(0,1.65fr)] sm:gap-6 md:py-8">
            <span className="font-mono text-sm font-medium tabular-nums text-primary">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item.module}</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-white">{item.title}</h3>
            </div>
            <p className="leading-relaxed text-muted-foreground">{item.desc}</p>
          </article>
        ))}
        <article className="grid gap-3 bg-primary/8 px-4 py-6 sm:grid-cols-[5rem_minmax(0,1.1fr)_minmax(0,1.65fr)] sm:gap-6 md:px-6 md:py-8">
          <span className="font-mono text-sm font-medium text-primary">+</span>
          <h3 className="text-lg font-semibold tracking-tight text-white">Live Mentorship &amp; Support Group</h3>
          <p className="leading-relaxed text-muted-foreground">Bimbingan berterusan selepas kelas tamat. Analisa pasaran bersama komuniti trader RasenganTrader.</p>
        </article>
      </div>
    </section>
  )
}

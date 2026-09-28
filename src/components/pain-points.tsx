const painPoints = [
  'Salah baca trend sebenar',
  'Chart penuh indicator',
  'Tak tahu kat mana level dan zone untuk entry',
  'Trade tanpa ada confirmation',
  'Tak mahir baca price action',
  'Tiada trading plan yang jelas',
]

export function PainPoints() {
  return (
    <section className="px-5 py-24 sm:px-8 md:py-32 lg:px-12 bg-background">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">MASALAH TRADER</p>
            <h2 className="mt-4 max-w-[14ch] text-[clamp(2.3rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
              Pernahkah anda mengalami masalah ini?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {painPoints.map((point) => (
              <div key={point} className="flex min-h-24 items-center gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-primary/80" />
                <p className="text-sm font-medium leading-6 text-foreground/80">{point}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex items-center gap-6 rounded-2xl bg-primary/5 p-8 sm:p-10">
          <div className="h-full w-1.5 shrink-0 rounded-full bg-primary" />
          <p className="text-[clamp(1.25rem,2.5vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-foreground">
            Jika ya, True SMC berpotensi menjadi solusi anda!
          </p>
        </div>
      </div>
    </section>
  )
}


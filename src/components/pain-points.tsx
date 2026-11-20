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
    <section className="bg-background px-5 py-24 sm:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center">
          <div>
            <p className="eyebrow">Masalah trader</p>
            <h2 className="mt-4 max-w-[14ch] text-[clamp(2.3rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
              Pernahkah anda mengalami masalah ini?
            </h2>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {painPoints.map((point, index) => (
              <li key={point} className="surface-card flex min-h-20 items-center gap-4 p-5 transition-colors hover:border-primary/50 sm:p-6">
                <span aria-hidden="true" className="font-mono text-xs font-medium tabular-nums text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm font-medium leading-6 text-foreground/85">{point}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="surface-tint mt-16 flex items-stretch gap-5 p-7 sm:gap-6 sm:p-10">
          <div aria-hidden="true" className="w-1 shrink-0 self-stretch rounded-full bg-primary" />
          <p className="text-[clamp(1.25rem,2.5vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-foreground">
            Jika ya, True SMC berpotensi menjadi solusi anda!
          </p>
        </div>
      </div>
    </section>
  )
}

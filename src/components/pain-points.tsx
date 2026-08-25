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
    <section className="border-b border-border px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">MASALAH TRADER</p>
            <h2 className="mt-4 max-w-[14ch] text-[clamp(2.3rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
              Pernahkah anda mengalami masalah ini?
            </h2>
          </div>
          <div className="grid border-t border-l border-border sm:grid-cols-2">
            {painPoints.map((point) => (
              <div key={point} className="flex min-h-24 items-center gap-4 border-r border-b border-border px-5 py-5">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-primary" />
                <p className="text-sm leading-6 text-[color:var(--color-ink-soft)]">{point}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 border-l-2 border-primary pl-5 text-[clamp(1.5rem,2.8vw,2.5rem)] font-semibold leading-tight tracking-[-0.045em] text-foreground">
          Jika ya, True SMC berpotensi menjadi solusi anda!
        </p>
      </div>
    </section>
  )
}

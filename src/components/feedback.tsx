const feedbacks = [
  {
    name: 'Ahmad S.',
    role: 'Trader Separuh Masa',
    content: 'Dulu asyik sangkut dengan indicator yang lambat. Lepas belajar True SMC Concept dengan Dr Hanis, pemahaman tentang price action jauh lebih tajam. Memang nampak jelas pergerakan sebenar market.'
  },
  {
    name: 'Zarith F.',
    role: 'Full-time Trader',
    content: 'Sangat berbaloi! Dr Hanis tak lokek ilmu dan ajar baca candlestick sebenar, bukan sekadar teori. Cara mapping market jadi lebih mudah dan entry lebih tajam. Terbaik RasenganTrader!'
  },
  {
    name: 'Faizal H.',
    role: 'Pelajar Baru',
    content: 'Dulu keliru sangat dengan pelbagai jenis indicator. Bila faham konsep "Liquidity Is King", trading plan jadi lebih konsisten. Kelas ni memang wajib join kalau betul-betul nak kuasai market.'
  }
]

export function Feedback() {
  return (
    <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">FEEDBACK</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
            Maklum balas daripada pelajar.
          </h2>
          <p className="mt-5 text-base leading-7 text-[color:var(--color-ink-soft)]">
            Apa kata mereka yang telah berjaya mengubah cara bacaan market melalui kelas RasenganTrader.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {feedbacks.map((item, index) => (
            <div key={index} className="flex flex-col justify-between border border-border bg-secondary/30 p-6 sm:p-8">
              <blockquote className="text-sm leading-relaxed text-[color:var(--color-ink-soft)] sm:text-base">
                &ldquo;{item.content}&rdquo;
              </blockquote>
              <div className="mt-8 border-t border-border pt-4">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

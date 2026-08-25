export function Hero() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
      <div className="lg:col-span-7 space-y-10 pr-0 lg:pr-8">
        <h1 className="font-serif text-5xl sm:text-6xl md:text-[5.5rem] leading-[1.05] tracking-tight">
          Candlestick Is The <span className="text-accent">Best</span> Indicator.
        </h1>
        <p className="font-sans text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
          Pembelajaran Teknik True Smart Money Concept (SMC)
        </p>
        <div className="pt-2">
          <a 
            href="https://t.me/HanishanafiRT" 
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-8 inline-flex items-center justify-center rounded-sm bg-accent text-paper font-medium text-base transition-transform hover:-translate-y-[1px] active:translate-y-[1px]"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
      
      <div className="lg:col-span-5 relative">
        <div className="absolute inset-0 bg-accent/5 -rotate-2 rounded-sm" />
        <div className="relative bg-paper-2 border border-rule p-8 rounded-sm shadow-sm backdrop-blur-sm">
          <h3 className="font-sans font-semibold text-lg mb-6 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Dr Hanis Hanafi
          </h3>
          <ul className="space-y-4 font-sans text-sm text-neutral">
            <li className="flex justify-between border-b border-rule/50 pb-3">
              <span>Peranan</span>
              <span className="text-ink font-medium">Founder of RasenganTrader</span>
            </li>
            <li className="flex justify-between border-b border-rule/50 pb-3">
              <span>Pengalaman</span>
              <span className="text-ink font-medium">5 years Stocks & Futures</span>
            </li>
            <li className="flex justify-between border-b border-rule/50 pb-3">
              <span>Pencapaian</span>
              <span className="text-ink font-medium">Mentored ~300 students</span>
            </li>
            <li className="flex justify-between border-b border-rule/50 pb-3">
              <span>Kelayakan</span>
              <span className="text-ink font-medium text-right max-w-[200px]">Certified Technical Analyst w/ Distinction</span>
            </li>
            <li className="flex justify-between pt-1">
              <span>Lesen MR</span>
              <span className="text-ink font-medium text-right max-w-[200px]">Mplus, Moomoo, Phillip Capital</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

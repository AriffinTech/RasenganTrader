import { ArrowUpRight } from 'lucide-react'

const platforms = [
  { 
    name: 'M+ Global', 
    link: 'https://m.global.mplusonline.com/kh/status/entry/transit?lang=en_US&_scnl=MR389064',
    features: [
      'Trade saham Bursa & US',
      'Dapat akses iSaham Pro (Remisier Anas Faris - Top Remisier Award)'
    ]
  },
  { 
    name: 'moomoo', 
    link: 'https://start.moomoo.com/0iuzT1',
    features: [
      'Trade saham Bursa & US',
      'Dapat Welcome Reward'
    ]
  },
  { 
    name: 'Phillip Capital', 
    link: 'https://oao.phillip.com.my/?aetag=MAU',
    features: [
      'Trade Futures seperti FCPO, CL & ZL',
      'Akaun under Remisier Dr Arif Zainudin (Top Remisier Award)'
    ]
  },
]

export function AccountOpening() {
  return (
    <section id="buka-akaun" className="scroll-mt-32 px-5 py-16 sm:px-8 sm:py-20 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">ADDITIONAL SERVICE</p>
            <h2 className="mt-4 max-w-[11ch] text-[clamp(2rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
              Buka Akaun.
            </h2>
          </div>
          <p className="max-w-[60ch] text-base leading-7 text-[color:var(--color-ink-soft)] sm:text-lg">
            Dapatkan bantuan untuk membuka akaun trading dengan platform pilihan anda.
          </p>
        </div>
        <div className="mt-10 grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {platforms.map(({ name, link, features }) => (
            <article key={name} className="flex min-h-64 flex-col justify-between px-0 py-7 md:px-7 lg:px-9">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.06em] text-foreground">{name}</h3>
                <ul className="mt-5 space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex text-sm leading-relaxed text-muted-foreground">
                      <span className="mr-3 text-primary">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a 
                href={link} 
                target="_blank"
                rel="noopener noreferrer"
                className="enroll-outline mt-8 w-fit px-4 text-sm font-semibold"
              >
                Buka akaun, klik sini
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </article>
          ))}
        </div>
        
        <div id="contact" className="scroll-mt-32 mt-12 flex flex-col items-center justify-center rounded-xl border border-border bg-secondary/10 px-6 py-10 text-center sm:px-10">
          <h3 className="text-xl font-semibold text-foreground">Perlukan Bantuan Tambahan?</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Jika anda nak bertanya tentang kelas / perlukan bantuan semasa buka akaun, hubungi saya di telegram.
          </p>
          <a
            href="https://t.me/HanishanafiRT"
            target="_blank"
            rel="noopener noreferrer"
            className="enroll-outline mt-6 w-fit px-6 text-sm font-semibold"
          >
            Contact melalui Telegram
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>

        <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-semibold text-foreground">Disclaimer:</strong> Link di atas mungkin mengandungi rujukan affiliate. Anda tetap bayar harga yang sama — kami terima sedikit komisen yang membantu kami bina lebih banyak kandungan percuma.
        </p>
      </div>
    </section>
  )
}

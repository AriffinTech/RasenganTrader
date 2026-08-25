import Image from 'next/image'

const feedbacks = [
  {
    name: 'Pelajar',
    role: 'Trader',
    image: '/feedback/feedback-new-1.jpg',
    content: 'Dr Hanis memang penyabar sangat. Walaupun saya tanya soalan yang sama berulang kali, Dr tetap layan. Teknik Dr ajar ni jadi salah satu edge saya, terutamanya bab imbalance candle dan cara marking zone yang valid.'
  },
  {
    name: 'Pelajar SMC',
    role: 'Trader',
    image: '/feedback/feedback-new-2.jpg',
    content: 'Selepas 4 tahun mencuba pelbagai teknik, ilmu SMC ini paling serasi dengan jiwa saya. Hanya belajar dari YouTube pun dah nampak hasil bila buat paper trade. Memang hebat!'
  },
  {
    name: 'Peserta Kelas',
    role: 'Trader Baru',
    image: '/feedback/feedback-new-3.jpg',
    content: 'Secara keseluruhan kelas sangat best dan banyak ilmu baru yang saya pelajari. Cara penerangan jelas, teratur dan mudah difahami. Memang berbaloi join dan saya akan rekomen pada orang lain.'
  },
  {
    name: 'Pelajar 1-to-1',
    role: 'Trader',
    image: '/feedback/feedback-new-4.jpg',
    content: 'Sesi 1-to-1 dengan Dr sangat best! Lebih faham dan jelas tentang market structure. Lepas ni dah boleh trade dengan lebih yakin sebab dah tahu cara manage risk dengan betul.'
  },
  {
    name: 'Pelajar FCPO',
    role: 'Trader',
    image: '/feedback/feedback-new-5.jpg',
    content: 'Kali pertama real trade FCPO dah berjaya cover yuran kelas! Modul sangat lengkap dengan contoh praktikal sebenar. Ada rakaman kelas juga jadi sangat senang nak buat ulang kaji.'
  },
  {
    name: 'Pelajar O&G',
    role: 'Trader Separuh Masa',
    image: '/feedback/feedback-new-6.jpg',
    content: 'Di ofis dah mula ramai kawan minta saya ajar trade SMC. Mereka tengok saya apply teknik ini dekat saham dan FCPO dua-dua menjadi. Saya terus bagi link kelas RasenganTrader pada mereka!'
  },
  {
    name: 'Pelajar Saham',
    role: 'Trader',
    image: '/feedback/feedback-new-7.jpg',
    content: 'Bila jelas trading plan, Take Profit (TP) dan Stop Loss (SL), semua trade jadi tenang. Dah lama tak merasa portfolio hijau macam ni. Terima kasih banyak-banyak Dr ajar SMC.'
  },
  {
    name: 'Pelajar Bimbingan',
    role: 'Trader',
    image: '/feedback/feedback-new-8.jpg',
    content: 'Ilmu Dr Hanis memang padu sangat! Bulan ni sahaja saya dah berjaya capai ROI lebih 100%. Terima kasih Dr dan rakan-rakan trader yang sentiasa banyak membantu.'
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
        <div className="mt-12 grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 xl:gap-12">
          {feedbacks.map((item, index) => (
            <div key={index} className="flex flex-col border border-border bg-secondary/30 p-6 sm:p-8">
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-border bg-black/20 mb-8">
                <Image 
                  src={item.image} 
                  alt={`Feedback ${index + 1}`} 
                  fill
                  className="object-contain object-center p-2"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <blockquote className="text-sm leading-relaxed text-[color:var(--color-ink-soft)] sm:text-base flex-grow">
                &ldquo;{item.content}&rdquo;
              </blockquote>
              <div className="mt-6 border-t border-border pt-4">
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

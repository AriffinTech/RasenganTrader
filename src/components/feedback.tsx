import { FeedbackGallery, type FeedbackItem } from '@/components/feedback-gallery'

const feedbacks: FeedbackItem[] = [
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
    <section id="feedback" className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-2xl">
          <p className="eyebrow">Feedback</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
            Maklum balas daripada pelajar.
          </h2>
          <p className="mt-5 text-base leading-7 text-[color:var(--color-ink-soft)]">
            Apa kata mereka yang telah berjaya mengubah cara bacaan market melalui kelas RasenganTrader.
          </p>
        </div>
        <FeedbackGallery items={feedbacks} />
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-5 text-muted-foreground">
          Maklum balas di atas adalah pengalaman individu pelajar. Keputusan lepas tidak menjamin keputusan masa hadapan; trading melibatkan risiko kerugian modal.
        </p>
      </div>
    </section>
  )
}

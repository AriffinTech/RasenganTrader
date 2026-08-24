import { EnrollmentLink } from '@/components/enrollment-link'

export function CtaStrip() {
  return (
    <section className="px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <div className="mx-auto flex max-w-[90rem] flex-col items-start justify-between gap-8 border-b border-border pb-12 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium tracking-[0.16em] text-primary">NEXT STEP</p>
          <h2 className="mt-4 text-[clamp(2.4rem,5vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.065em] text-foreground">
            Bina keputusan yang lebih berasas pada harga.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[color:var(--color-ink-soft)] sm:text-lg">
            Pendaftaran kini dibuka. Tempah tempat anda dan teruskan ke payment gateway apabila ia dikonfigurasi.
          </p>
        </div>
        <EnrollmentLink variant="outline" className="px-5 text-sm font-semibold sm:px-6">
          Daftar Sekarang
        </EnrollmentLink>
      </div>
    </section>
  )
}

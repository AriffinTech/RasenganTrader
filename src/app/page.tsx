export const revalidate = 60; // Ensure ISR revalidates every 60s

import { CourseMap } from '@/components/course-map'
import { CourseDetails } from '@/components/course-details'
import { Feedback } from '@/components/feedback'
import { Footer } from '@/components/footer'
import { Founder } from '@/components/founder'
import { AccountOpening } from '@/components/account-opening'
import { MobileCta } from '@/components/mobile-cta'
import { PainPoints } from '@/components/pain-points'
import { Header } from '@/components/site-header'
import { CredibilityStrip, HeroSection } from '@/components/ui/hero-1'
import { getClassSessionByOffer } from '@/lib/db/courses'

export default async function Home() {
  const fastTrack = await getClassSessionByOffer('fast-track')
  const fastTrackOpen = fastTrack?.status === 'open' || fastTrack?.status === 'completed_registering'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header overlay />
      <main className="grow">
        <HeroSection />
        <CredibilityStrip />
        <PainPoints />
        <CourseMap />
        <CourseDetails />
        <Founder />
        <Feedback />
        <AccountOpening />
      </main>
      <Footer />
      {fastTrack && fastTrackOpen ? (
        <MobileCta
          enrollOpen
          title="True SMC Fast Track"
          detail={`RM${(fastTrack.price_cents / 100).toLocaleString('en-US')} · ${fastTrack.display_date}`}
        />
      ) : (
        <MobileCta enrollOpen={false} title="Kelas RasenganTrader" detail="Saham · FCPO · True SMC" />
      )}
    </div>
  )
}

export const revalidate = 60; // Ensure ISR revalidates every 60s

import { CourseMap } from '@/components/course-map'
import { CourseDetails } from '@/components/course-details'
import { Feedback } from '@/components/feedback'
import { Footer } from '@/components/footer'
import { Founder } from '@/components/founder'
import ClassSchedule from '@/components/class-schedule'
import { AccountOpening } from '@/components/account-opening'
import { PainPoints } from '@/components/pain-points'
import { Header } from '@/components/ui/header-1'
import { CredibilityStrip, HeroSection } from '@/components/ui/hero-1'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
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
    </div>
  )
}

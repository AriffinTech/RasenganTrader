import { CourseMap } from '@/components/course-map'
import { CourseDetails } from '@/components/course-details'
import { CtaStrip } from '@/components/cta-strip'
import { Footer } from '@/components/footer'
import { Founder } from '@/components/founder'
import { Header } from '@/components/ui/header-1'
import { CredibilityStrip, HeroSection } from '@/components/ui/hero-1'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="grow">
        <HeroSection />
        <CredibilityStrip />
        <CourseMap />
        <CourseDetails />
        <Founder />
        <CtaStrip />
      </main>
      <Footer />
    </div>
  )
}

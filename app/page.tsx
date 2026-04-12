import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { StoryCarousel } from "@/components/story-carousel"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturesSection } from "@/components/features-section"
import { ImpactSection } from "@/components/impact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StoryCarousel />
      <HowItWorks />
      <FeaturesSection />
      <ImpactSection />
      <Footer />
    </main>
  )
}

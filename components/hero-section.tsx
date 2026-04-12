import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/30 to-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Financial Freedom{" "}
              <span className="text-primary">for Women</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              A community-powered lending and savings platform designed to empower women with accessible credit and meaningful returns.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full px-12 text-lg">
                <Link href="/app">Launch App</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/hero-women.jpg"
                alt="Group of Indian rural women standing together, representing community empowerment"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-accent/40 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

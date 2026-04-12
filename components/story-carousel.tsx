"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const stories = [
  {
    title: "Borrow when you need",
    description: "Access microloans tailored to your needs, with fair terms and community support.",
    icon: "💰",
  },
  {
    title: "Save when you can",
    description: "Build financial security with our flexible savings programs designed for your income patterns.",
    icon: "🌱",
  },
  {
    title: "Global support for local women",
    description: "Connect with lenders worldwide who believe in empowering women entrepreneurs.",
    icon: "🌍",
  },
  {
    title: "Build your credit trust",
    description: "Establish your financial reputation and unlock better opportunities over time.",
    icon: "⭐",
  },
]

export function StoryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }

  return (
    <section className="bg-accent/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">Our Promise</h2>
        </div>
        
        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {stories.map((story, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="mx-auto max-w-xl border-none bg-card/80 shadow-lg backdrop-blur">
                    <CardContent className="p-8 text-center">
                      <span className="mb-4 block text-5xl">{story.icon}</span>
                      <h3 className="mb-3 text-2xl font-semibold text-foreground">
                        {story.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {story.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="mt-6 flex justify-center gap-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

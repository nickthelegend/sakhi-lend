import { UserCheck, Wallet, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: UserCheck,
    title: "Get Verified",
    description: "Complete your profile and get your Trust Score (TTF) calculated based on your community standing.",
    step: "01",
  },
  {
    icon: Wallet,
    title: "Borrow or Save",
    description: "Access microloans when needed or start saving to earn returns on your deposits.",
    step: "02",
  },
  {
    icon: TrendingUp,
    title: "Earn and Grow",
    description: "Build your financial history, unlock better rates, and grow your economic independence.",
    step: "03",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20" id="about">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Getting started with Sakhilend is simple and designed for everyone.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-card p-8 shadow-sm transition-all hover:shadow-lg"
            >
              <span className="absolute -top-4 right-4 text-6xl font-bold text-primary/10">
                {step.step}
              </span>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

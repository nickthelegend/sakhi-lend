import { Users, PiggyBank, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Users,
    title: "P2P Lending",
    description: "Connect directly with lenders who want to support women entrepreneurs in rural communities.",
  },
  {
    icon: PiggyBank,
    title: "Yield Savings",
    description: "Earn attractive returns on your savings while contributing to the community lending pool.",
  },
  {
    icon: Shield,
    title: "On-chain Credit Trust",
    description: "Build a transparent and portable credit history that follows you and opens new opportunities.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-accent/20 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Platform Features
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Designed with women in mind, our platform offers tools that make financial empowerment accessible to all.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-none bg-card shadow-sm transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

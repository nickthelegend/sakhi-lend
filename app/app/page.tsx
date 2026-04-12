import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PiggyBank, Users, Wallet, ArrowRight } from "lucide-react"

export default function AppPage() {
  const roles = [
    {
      title: "Beneficiary",
      description: "Access verified loans and manage your credit score on-chain.",
      icon: Users,
      href: "/app/borrower/dashboard",
      color: "bg-blue-500/10 text-blue-500",
      cta: "Borrow Fund"
    },
    {
      title: "Lender",
      description: "Fund global micro-loans and earn yield while empowering women.",
      icon: Wallet,
      href: "/app/lender/dashboard",
      color: "bg-primary/10 text-primary",
      cta: "Lend Now"
    },
    {
      title: "DigiSavings",
      description: "UPI-linked yield savings simulator. Save in INR, earn in USDC.",
      icon: PiggyBank,
      href: "/app/savings",
      color: "bg-green-500/10 text-green-500",
      cta: "Start Saving"
    }

  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Choose Your Role</h1>
          <p className="text-muted-foreground text-lg">
            Select how you want to participate in the SakhiLend ecosystem today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {roles.map((role) => (
            <Link key={role.title} href={role.href} className="flex h-full">
              <Card className="group flex flex-col w-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base min-h-[3rem]">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full group-hover:gap-3 transition-all pointer-events-none">
                    {role.cta} <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  )
}

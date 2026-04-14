"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LenderSidebar } from "@/components/lender-sidebar"
import {
  Target,
  PlusCircle,
  Wallet,
  TrendingUp,
  DollarSign,
  Users,
  Heart,
  Eye,
} from "lucide-react"
import { useAlgorandSigner } from "@/hooks/use-algorand-signer"
import { getYieldVaultClient, getContractIds } from "@/lib/algorand/client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { WalletGuard } from "@/components/wallet-guard"
import { useUserSync } from "@/hooks/use-user-sync"

interface LendingItem {
  _id: string
  borrowerName: string
  businessName: string
  loanAmount: number
  currentFunding: number
  imageUrl: string
}

export default function LenderDashboard() {
  const { activeAddress } = useAlgorandSigner()
  useUserSync() // Sync lender profile to MongoDB
  const [totalInvested, setTotalInvested] = useState(0)
  const [activeLoans, setActiveLoans] = useState<LendingItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const { yieldVaultAppId } = getContractIds()

  useEffect(() => {
    if (!activeAddress) return
    const sync = async () => {
      try {
        const client = getYieldVaultClient(activeAddress)
        const balance = await client.getBalance({ args: { user: activeAddress } })
        setTotalInvested(Number(balance.return) / 1_000_000)

        // Fetch active loans from MongoDB (represents real on-chain loans)
        const res = await fetch('/api/loans')
        const data = await res.json()
        // Show only active loans for Impact section
        const activeOnes = data.filter((l: any) => l.status === 'active')
        setActiveLoans(activeOnes)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    sync()
  }, [activeAddress])

  const impactStats = [
    { label: "Women Supported", value: activeLoans.length.toString(), icon: Users },
    { label: "Jobs Created", value: (activeLoans.length * 3).toString(), icon: Target },
    { label: "Communities Reached", value: Math.ceil(activeLoans.length / 2).toString(), icon: Heart },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      {/* Main Content */}
      <main className="flex-1">
        <WalletGuard role="lender">
          <header className="border-b border-border bg-card px-6 py-4">

          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Welcome, Investor!</h1>
              <p className="text-sm text-muted-foreground font-medium">Track your impact and social returns</p>
            </div>
            <Button asChild className="gap-2 rounded-full px-6 shadow-md hover:shadow-lg transition-all active:scale-95">
              <Link href="/app/savings">
                <PlusCircle className="h-4 w-4" />
                <span>Add Funds</span>
              </Link>
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Portfolio Overview */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 ring-1 ring-primary/30">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Total Invested</p>
                    <p className="text-2xl font-black text-foreground">${totalInvested.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-chart-2/10 rounded-full blur-2xl" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-chart-2/20 ring-1 ring-chart-2/30">
                    <TrendingUp className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Returns (Est.)</p>
                    <p className="text-2xl font-black text-foreground">₹{(totalInvested * 84.5 * 0.12).toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-chart-4/10 rounded-full blur-2xl" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-chart-4/20 ring-1 ring-chart-4/30">
                    <DollarSign className="h-6 w-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Target Yield</p>
                    <p className="text-2xl font-black text-foreground">12.0%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-chart-1/10 rounded-full blur-2xl" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-chart-1/20 ring-1 ring-chart-1/30">
                    <Users className="h-6 w-6 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Supported</p>
                    <p className="text-2xl font-black text-foreground">{activeLoans.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Section */}
          <Card className="mb-8 overflow-hidden border-none bg-gradient-to-br from-primary/5 to-chart-2/5 backdrop-blur-sm shadow-inner p-1">
            <div className="grid lg:grid-cols-3 bg-card rounded-[calc(var(--radius)-1px)] overflow-hidden">
              <div className="relative col-span-1 hidden aspect-square lg:block">
                <Image
                  src="/images/lender-support.jpg"
                  alt="Women entrepreneurs being supported"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card" />
              </div>
              <div className="col-span-2 p-8">
                <CardTitle className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
                  <Heart className="h-6 w-6 text-primary fill-primary/20" />
                  Our Collective Impact
                </CardTitle>
                <CardDescription className="mb-8 text-base">
                  Your capital doesn't just earn yield; it builds poultry farms, tailoring units, and grocery stores. 
                  Every ₹100 lent is a step towards financial sovereignty for a Sakhi.
                </CardDescription>
                <div className="grid grid-cols-3 gap-6">
                  {impactStats.map((stat, index) => (
                    <div key={index} className="rounded-2xl bg-accent/30 p-6 text-center border border-border/50 shadow-sm transition-all hover:bg-accent/50">
                      <stat.icon className="mx-auto mb-3 h-10 w-10 text-primary opacity-80" />
                      <p className="text-3xl font-black text-foreground">{stat.value}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Active Lendings */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">My Active Impact</CardTitle>
                <CardDescription className="text-sm font-medium">Personal tracking of women you've backed</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-2 rounded-full font-bold text-primary hover:bg-primary/5">
                <Link href="/app/lender/browse">
                  <Eye className="h-4 w-4" />
                  View More
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeLoans.map((lending) => {
                  const progress = Math.min(100, Math.round((lending.currentFunding || 0) / (lending.loanAmount || 1) * 100))
                  
                  return (
                    <div
                      key={lending._id}
                      className="group flex flex-col gap-4 rounded-2xl border border-border/50 p-5 sm:flex-row sm:items-center transition-all hover:bg-accent/20 hover:border-primary/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-accent ring-2 ring-primary/5 transition-transform group-hover:scale-105">
                          <Image
                            src={lending.imageUrl || "/images/impact-woman.jpg"}
                            alt={lending.borrowerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-[140px]">
                          <p className="font-bold text-foreground leading-tight">{lending.borrowerName}</p>
                          <p className="text-xs font-semibold text-primary">{lending.businessName}</p>
                        </div>
                      </div>

                      <div className="flex-1 sm:px-6">
                        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-muted-foreground">Funding Goal</span>
                          <span className="text-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 rounded-full overflow-hidden" />
                      </div>

                      <div className="flex items-center gap-10">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter mb-0.5">Your Share</p>
                          <p className="text-lg font-black text-foreground">₹{(lending.loanAmount * 0.1).toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 border border-chart-2/20 font-bold px-3 py-1">
                            12% APY
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        </WalletGuard>
      </main>
    </div>
  )
}


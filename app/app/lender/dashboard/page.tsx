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

const activeLendings = [
  {
    name: "Priya Sharma",
    purpose: "Tailoring Business",
    amount: "₹25,000",
    funded: 80,
    yield: "12%",
    image: "/images/beneficiary-woman.jpg",
  },
  {
    name: "Lakshmi Devi",
    purpose: "Vegetable Farming",
    amount: "₹30,000",
    funded: 100,
    yield: "10%",
    image: "/images/impact-woman.jpg",
  },
  {
    name: "Meera Kumari",
    purpose: "Handicraft Shop",
    amount: "₹20,000",
    funded: 65,
    yield: "11%",
    image: "/images/hero-women.jpg",
  },
]

const impactStats = [
  { label: "Women Supported", value: "12", icon: Users },
  { label: "Jobs Created", value: "35", icon: Target },
  { label: "Communities Reached", value: "8", icon: Heart },
]

export default function LenderDashboard() {
  const { activeAddress } = useAlgorandSigner()
  useUserSync() // Sync lender profile to MongoDB
  const [totalInvested, setTotalInvested] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const { yieldVaultAppId } = getContractIds()

  useEffect(() => {
    if (!activeAddress) return
    const sync = async () => {
      try {
        const client = getYieldVaultClient(activeAddress)
        const balance = await client.getBalance({ args: { user: activeAddress } })
        setTotalInvested(Number(balance.return) / 1_000_000)
      } catch (e) {
        console.error(e)
      }
    }
    sync()
  }, [activeAddress])

  return (
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      {/* Main Content */}
      <main className="flex-1">
        <WalletGuard>
          <header className="border-b border-border bg-card px-6 py-4">

          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Welcome, Investor!</h1>
              <p className="text-sm text-muted-foreground">Track your lending impact and returns</p>
            </div>
            <Button asChild className="gap-2 rounded-full">
              <Link href="/app/savings">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Add Funds</span>
              </Link>
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Portfolio Overview */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invested (USDC)</p>
                    <p className="text-2xl font-bold text-foreground">${totalInvested.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                    <TrendingUp className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Returns</p>
                    <p className="text-2xl font-bold text-foreground">₹18,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/20">
                    <DollarSign className="h-6 w-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Yield</p>
                    <p className="text-2xl font-bold text-foreground">12.3%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/20">
                    <Users className="h-6 w-6 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Loans</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Section */}
          <Card className="mb-8 overflow-hidden">
            <div className="grid lg:grid-cols-3">
              <div className="relative col-span-1 hidden aspect-square lg:block">
                <Image
                  src="/images/lender-support.jpg"
                  alt="Women entrepreneurs being supported"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="col-span-2 p-6">
                <CardTitle className="mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Your Impact
                </CardTitle>
                <CardDescription className="mb-6">
                  See how your investments are making a real difference in rural communities
                </CardDescription>
                <div className="grid grid-cols-3 gap-4">
                  {impactStats.map((stat, index) => (
                    <div key={index} className="rounded-xl bg-accent/50 p-4 text-center">
                      <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Active Lendings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Lendings</CardTitle>
                  <CardDescription>Track your funded beneficiaries</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link href="/lender/portfolio">
                    <Eye className="h-4 w-4" />
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeLendings.map((lending, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-full bg-accent">
                        <Image
                          src={lending.image}
                          alt={lending.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lending.name}</p>
                        <p className="text-sm text-muted-foreground">{lending.purpose}</p>
                      </div>
                    </div>

                    <div className="flex-1 sm:px-6">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-medium text-foreground">{lending.funded}%</span>
                      </div>
                      <Progress value={lending.funded} className="h-2" />
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{lending.amount}</p>
                        <p className="text-xs text-muted-foreground">Amount</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">
                          {lending.yield} Yield
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </WalletGuard>
      </main>
    </div>
  )
}


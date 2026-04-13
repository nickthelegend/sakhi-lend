"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LenderSidebar } from "@/components/lender-sidebar"
import {
  Search,
  Filter,
  MapPin,
  Shield,
  Loader2,
} from "lucide-react"
import { WalletGuard } from "@/components/wallet-guard"

interface LoanBeneficiary {
  _id: string
  borrowerName: string
  businessName: string
  loanPurpose: string
  story: string
  loanAmount: number
  repaymentPeriod: number
  location: string
  imageUrl: string
  trustScore?: number
  fundingGoal: number
  currentFunding: number
}

export default function BrowsePage() {
  const [loans, setLoans] = useState<LoanBeneficiary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLoans() {
      try {
        const res = await fetch('/api/loans')
        const data = await res.json()
        setLoans(data)
      } catch (err) {
        console.error("Failed to fetch loans:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLoans()
  }, [])

  return (
    <WalletGuard role="lender">
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Browse Beneficiaries</h1>
              <p className="text-sm text-muted-foreground">Find and support women entrepreneurs in rural India</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card className="mb-6 overflow-hidden border-none bg-gradient-to-r from-primary/5 to-chart-2/5 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name, business, or village..." className="pl-10 rounded-full border-muted/20" />
                </div>
                <Button variant="outline" className="gap-2 rounded-full px-6">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {loans.map((loan) => {
                const progress = Math.min(100, Math.round((loan.currentFunding || 0) / (loan.loanAmount || 1) * 100))
                
                return (
                  <Card key={loan._id} className="group overflow-hidden border-muted/20 transition-all hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4 border-b border-border/50 p-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-accent ring-2 ring-primary/10 transition-transform group-hover:scale-105">
                          <Image
                            src={loan.imageUrl || "/images/impact-woman.jpg"}
                            alt={loan.borrowerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-foreground leading-tight">{loan.borrowerName}</h3>
                              <p className="text-sm font-medium text-primary">{loan.businessName}</p>
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 border border-primary/20">
                              <Shield className="h-3 w-3 text-primary" />
                              <span className="text-xs font-bold text-primary">{loan.trustScore || 720}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <MapPin className="h-3 w-3" />
                            {loan.location || "Mhaswad, Satara"}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 italic leading-relaxed">
                          "{loan.story}"
                        </p>

                        <div className="mb-6">
                          <div className="mb-2 flex justify-between text-sm items-end">
                            <span className="text-muted-foreground font-medium">Funding Progress</span>
                            <span className="font-bold text-primary">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2 rounded-full overflow-hidden" />
                        </div>

                        <div className="mb-6 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Loan Goal</p>
                            <p className="text-xl font-black text-foreground">₹{loan.loanAmount.toLocaleString()}</p>
                          </div>
                          <div className="text-right space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Yield</p>
                            <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 border border-chart-2/20 font-bold px-3">
                              12% APY
                            </Badge>
                          </div>
                        </div>

                        <Button className="w-full rounded-full h-11 font-bold text-white bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95">
                          Support {loan.borrowerName.split(' ')[0]}'s Dream
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
    </WalletGuard>
  )
}

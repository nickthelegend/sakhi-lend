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
  loanId: string
  borrowerName: string
  businessName: string
  story: string
  loanAmount: number
  businessCategory: string
  photoUrl: string
  mannDeshiScore: number
  status: string
}

export default function BrowsePage() {
  const [loans, setLoans] = useState<LoanBeneficiary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLoans() {
      try {
        const res = await fetch('/api/loans')
        const data = await res.json()
        // Filter to show loans that are pending/approved (browsable)
        setLoans(data.filter((l: any) => ['pending', 'approved', 'active'].includes(l.status)))
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
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground uppercase">Real Impact Market</h1>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Filter & support women entrepreneurs with real-world yield</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card className="mb-6 overflow-hidden border-none bg-primary/5 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name, business, or Sakhi project..." className="pl-10 rounded-xl border-border/50 bg-background/50" />
                </div>
                <Button variant="outline" className="gap-2 rounded-xl px-6">
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
          ) : loans.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No loans currently available for browse.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {loans.map((loan) => {
                const progress = loan.status === 'active' ? 100 : Math.floor(Math.random() * 40)
                
                return (
                  <Card key={loan._id} className="group overflow-hidden border-border transition-all hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-0 text-foreground">
                      <div className="flex items-start gap-4 border-b border-border/50 p-4 bg-muted/30">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-accent ring-2 ring-primary/10 transition-transform group-hover:scale-105">
                          <Image
                            src={loan.photoUrl || "/images/impact-woman.jpg"}
                            alt={loan.borrowerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-black text-lg text-foreground uppercase tracking-tight leading-tight">{loan.borrowerName}</h3>
                              <p className="text-xs font-bold text-primary italic">{loan.businessName}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 border border-primary/20">
                                  <Shield className="h-3 w-3 text-primary" />
                                  <span className="text-xs font-black text-primary">{loan.mannDeshiScore || 720}</span>
                                </div>
                                <p className="text-[8px] font-bold text-muted-foreground mt-1 tracking-widest uppercase">Score</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            <MapPin className="h-3 w-3" />
                            Mhaswad, Satara (Rural India)
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-sm text-foreground/80 line-clamp-3 mb-6 font-medium italic leading-relaxed">
                          "{loan.story}"
                        </p>

                        <div className="mb-6">
                          <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-widest items-end">
                            <span className="text-muted-foreground">Crowdfunding Status</span>
                            <span className="text-primary font-black">{progress}% Funded</span>
                          </div>
                          <Progress value={progress} className="h-1.5 rounded-full overflow-hidden" />
                        </div>

                        <div className="mb-6 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Principal Required</p>
                            <p className="text-2xl font-black text-foreground">₹{(loan.loanAmount * 84).toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground font-bold">(${loan.loanAmount} USDC)</p>
                          </div>
                          <div className="text-right space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Sakhi Yield</p>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border border-green-500/20 font-black px-3 py-1 text-sm">
                              12% APY
                            </Badge>
                          </div>
                        </div>

                        <Button className="w-full rounded-xl h-12 font-black text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 text-primary-foreground">
                          {loan.status === 'active' ? 'VIEW IMPACT' : `SUPPORT ${loan.borrowerName.split(' ')[0].toUpperCase()}'S DREAM`}
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

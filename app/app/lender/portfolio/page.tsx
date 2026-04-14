"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LenderSidebar } from "@/components/lender-sidebar"
import { Filter, RefreshCcw, Wallet } from "lucide-react"
import { useWallet } from "@txnlab/use-wallet-react"
import { getYieldVaultClient, fetchVaultBalance } from "@/lib/algorand/client"
import { toast } from "sonner"

export default function PortfolioPage() {
  const { activeAddress } = useWallet()
  const [loading, setLoading] = useState(true)
  const [rate, setRate] = useState(83.5) // Default fallback
  const [totalInvestedUSD, setTotalInvestedUSD] = useState(0)
  const [activeLoans, setActiveLoans] = useState<any[]>([])

  useEffect(() => {
    syncPortfolio()
  }, [activeAddress])

  const syncPortfolio = async () => {
    setLoading(true)
    try {
      // 1. Fetch Real-time USD to INR Rate
      const rateRes = await fetch('/api/currency/rate')
      const rateData = await rateRes.json()
      if (rateData.rate) {
        setRate(rateData.rate)
        console.log(`[Portfolio] Live Rate: 1 USD = ${rateData.rate} INR`)
      }

      if (activeAddress) {
        // 2. Fetch Real Investment from YieldVault using simulation (No Signatures Required)
        const balance = await fetchVaultBalance(activeAddress)
        setTotalInvestedUSD(balance / 1_000_000)

        // 3. Fetch Real Active Loans
        const loanRes = await fetch('/api/loans')
        const allLoans = await loanRes.json()
        // Filter for active or repaid loans that represent portfolio impact
        setActiveLoans(allLoans.filter((l: any) => ['active', 'repaid'].includes(l.status)))
      }
    } catch (e) {
      console.error(e)
      toast.error("Failed to sync portfolio data")
    } finally {
      setLoading(false)
    }
  }

  const toINR = (usd: number) => Math.round(usd * rate).toLocaleString()

  return (
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">My Portfolio</h1>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Track all your real-world investments</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={syncPortfolio} disabled={loading}>
                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Sync
              </Button>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8 grid gap-6 sm:grid-cols-3">
            <Card className="bg-primary/5 border-primary/20 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-12 h-12" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 text-foreground">Total Invested (INR)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-foreground">₹{toINR(totalInvestedUSD)}</p>
                  <p className="text-xs text-muted-foreground font-bold">(${totalInvestedUSD.toFixed(1)})</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-6">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 text-foreground">Real-time FX Rate</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-3xl font-black text-foreground">₹{rate.toFixed(2)}</p>
                   <p className="text-[10px] font-bold text-muted-foreground">/ 1 USD</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-6">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 text-foreground">Active Sakhis</p>
                <p className="text-3xl font-black text-primary">{activeLoans.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden bg-white/5 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-xl font-black font-display tracking-tight text-foreground uppercase">Investment Details</CardTitle>
              <CardDescription className="text-sm font-medium">Real-time tracking of your funded beneficiaries and on-chain yield</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {loading ? (
                   <div className="p-12 text-center text-muted-foreground">Loading your portfolio...</div>
                ) : activeLoans.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                    <p>No active investments found. Your portfolio is empty.</p>
                  </div>
                ) : (
                  activeLoans.map((item) => (
                    <div key={item._id} className="p-6 transition-all hover:bg-accent/5">
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4 sm:w-1/4">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-border/50">
                            <Image
                              src={item.photoUrl || "/images/impact-woman.jpg"}
                              alt={item.borrowerName}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-black text-foreground uppercase tracking-tight leading-tight">{item.borrowerName}</p>
                            <p className="text-xs font-bold text-muted-foreground">{item.businessName}</p>
                            <Badge variant="outline" className="mt-1 text-[10px] font-mono border-muted-foreground/30 text-muted-foreground">ID: {item.loanId}</Badge>
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Repayment Progress</span>
                            <span>{item.status === 'repaid' ? '100%' : '15%'}</span>
                          </div>
                          <Progress value={item.status === 'repaid' ? 100 : 15} className="h-1.5" />
                        </div>

                        <div className="flex items-center justify-around sm:w-1/3">
                          <div className="text-center">
                            <p className="text-lg font-black text-foreground">₹{toINR(item.loanAmount)}</p>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest font-mono">Principal</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-black text-chart-2">₹{toINR(item.status === 'active' ? item.loanAmount * 0.04 : item.loanAmount * 1.12)}</p>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest font-mono">Returns</p>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                             <Badge variant={item.status === "active" ? "default" : "secondary"} className="rounded-full px-3 font-bold border-primary text-primary bg-primary/10">
                              12% APY
                            </Badge>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase">{item.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BeneficiarySidebar } from "@/components/beneficiary-sidebar"
import {
  Wallet,
  PiggyBank,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { WalletGuard } from "@/components/wallet-guard"
import { useAlgorandSigner } from "@/hooks/use-algorand-signer"
import { 
  getLoanPoolClient, 
  getYieldVaultClient,
  fetchLoanByBorrower,
  fetchVaultBalance,
  fetchTrustScore
} from "@/lib/algorand/client"
import { useState, useEffect } from "react"

export default function BeneficiaryDashboard() {
  const { activeAddress } = useAlgorandSigner()
  const [loanStats, setLoanStats] = useState({ 
    amount: 0, 
    repaid: 0, 
    active: false,
    loanId: 0n,
    status: 0n,
    purpose: "",
    interestRate: 0n,
    ttfScore: 0n
  })
  const [savingsBalance, setSavingsBalance] = useState(0)
  const [trustScore, setTrustScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!activeAddress) return
    const sync = async () => {
      try {
        setIsLoading(true)
        
        // 1. Fetch Loan from Pool using simulation
        const loan = await fetchLoanByBorrower(activeAddress)
        if (loan) {
            setLoanStats({
              amount: Number(loan.amount) / 1_000_000,
              repaid: Number(loan.amountRepaid) / 1_000_000,
              active: loan.status === 2n, // 2 = Active
              loanId: loan.loanId,
              status: loan.status,
              purpose: loan.purpose,
              interestRate: loan.interestRateBps,
              ttfScore: loan.ttfScore
            })
        } else {
          console.log("[SakhiLend DEBUG] No active loan found for user")
          setLoanStats(prev => ({ ...prev, active: false }))
        }
 
        // 2. Fetch Vault Balance using simulation
        const balance = await fetchVaultBalance(activeAddress)
        setSavingsBalance(balance / 1_000_000)
 
        // 3. Fetch Trust Score using simulation
        const score = await fetchTrustScore(activeAddress)
        setTrustScore(score)
 
      } catch (e) {
        console.error("[SakhiLend DEBUG] Sync Error:", e)
      } finally {
        setIsLoading(false)
      }
    }
    sync()
  }, [activeAddress])

  const formatINR = (usdc: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(usdc * 84)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <BeneficiarySidebar />

      {/* Main Content */}
      <main className="flex-1">
        <WalletGuard>
          <header className="border-b border-border bg-card px-6 py-4">

          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Welcome Back!</h1>
              <p className="text-sm text-muted-foreground">Here&apos;s your financial overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground">Trust Score</p>
                <p className="text-2xl font-bold text-primary">{trustScore || "..."}</p>
              </div>
              <div className="h-12 w-12 overflow-hidden rounded-full bg-accent">
                <Image
                  src="/images/beneficiary-woman.jpg"
                  alt="Profile"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                   <div>
                    <p className="text-sm text-muted-foreground">Active Loan</p>
                    <p className="text-2xl font-bold text-foreground">{loanStats.active ? formatINR(loanStats.amount) : "No Active Loan"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                    <PiggyBank className="h-6 w-6 text-chart-2" />
                  </div>
                   <div>
                    <p className="text-sm text-muted-foreground">Savings</p>
                    <p className="text-2xl font-bold text-foreground">{formatINR(savingsBalance)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/20">
                    <TrendingUp className="h-6 w-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Yield Earned</p>
                    <p className="text-2xl font-bold text-foreground">{formatINR(savingsBalance * 0.06 / 12)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/20">
                    <CheckCircle2 className="h-6 w-6 text-chart-1" />
                  </div>
                   <div>
                    <p className="text-sm text-muted-foreground">Repaid</p>
                    <p className="text-2xl font-bold text-foreground">{loanStats.repaid > 0 ? formatINR(loanStats.repaid) : "₹0"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loan Progress */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card>
               <CardHeader>
                <CardTitle>Current Loan Progress</CardTitle>
                <CardDescription>{formatINR(loanStats.repaid)} of {formatINR(loanStats.amount)} repaid</CardDescription>
              </CardHeader>
               <CardContent>
                <Progress value={loanStats.amount > 0 ? (loanStats.repaid / loanStats.amount) * 100 : 0} className="mb-4 h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{loanStats.amount > 0 ? Math.round((loanStats.repaid / loanStats.amount) * 100) : 0}% completed</span>
                  <span>{formatINR(Math.max(0, loanStats.amount - loanStats.repaid))} remaining</span>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Next EMI: {loanStats.active ? formatINR(loanStats.amount / 6) : "None due"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your finances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start rounded-lg" variant="outline">
                  <Link href="/beneficiary/loans">
                    <Wallet className="mr-2 h-4 w-4" />
                    Apply for New Loan
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start rounded-lg" variant="outline">
                  <Link href="/beneficiary/savings">
                    <PiggyBank className="mr-2 h-4 w-4" />
                    Add to Savings
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start rounded-lg" variant="outline">
                  <Link href="/beneficiary/documents">
                    <FileText className="mr-2 h-4 w-4" />
                    View Statements
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "payment", description: "EMI Payment", amount: "-₹2,500", date: "Mar 15, 2026" },
                  { type: "savings", description: "Savings Deposit", amount: "+₹1,000", date: "Mar 10, 2026" },
                  { type: "yield", description: "Yield Credit", amount: "+₹150", date: "Mar 1, 2026" },
                  { type: "payment", description: "EMI Payment", amount: "-₹2,500", date: "Feb 15, 2026" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-foreground">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <span className={`font-semibold ${activity.amount.startsWith("+") ? "text-chart-2" : "text-foreground"}`}>
                      {activity.amount}
                    </span>
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


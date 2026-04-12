"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BeneficiarySidebar } from "@/components/beneficiary-sidebar"
import {
  PiggyBank,
  Plus,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const transactions = [
  { type: "deposit", amount: 1000, date: "Mar 10, 2026", balance: 8500 },
  { type: "yield", amount: 150, date: "Mar 1, 2026", balance: 7500 },
  { type: "deposit", amount: 1500, date: "Feb 15, 2026", balance: 7350 },
  { type: "withdraw", amount: 500, date: "Feb 1, 2026", balance: 5850 },
  { type: "yield", amount: 120, date: "Feb 1, 2026", balance: 6350 },
]

export default function SavingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <BeneficiarySidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Savings</h1>
              <p className="text-sm text-muted-foreground">Grow your savings with attractive yields</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-2/20">
                    <PiggyBank className="h-8 w-8 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-4xl font-bold text-foreground">₹8,500</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-accent/50 p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-chart-2" />
                      <span className="text-sm text-muted-foreground">Yield Earned</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold text-chart-2">₹1,200</p>
                  </div>
                  <div className="rounded-xl bg-accent/50 p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Current Yield</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold text-primary">8% APY</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">Amount</label>
                  <Input type="number" placeholder="Enter amount" className="mb-3" />
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2">
                      <Plus className="h-4 w-4" />
                      Deposit
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Withdraw
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent savings activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        tx.type === "withdraw" ? "bg-destructive/10" : "bg-chart-2/20"
                      }`}>
                        {tx.type === "withdraw" ? (
                          <ArrowDownRight className="h-5 w-5 text-destructive" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-chart-2" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {tx.type === "yield" ? "Yield Credit" : tx.type}
                        </p>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${tx.type === "withdraw" ? "text-destructive" : "text-chart-2"}`}>
                        {tx.type === "withdraw" ? "-" : "+"}₹{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Balance: ₹{tx.balance.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

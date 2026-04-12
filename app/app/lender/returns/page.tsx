"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LenderSidebar } from "@/components/lender-sidebar"
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react"

const transactions = [
  { type: "return", name: "Priya Sharma", amount: 1500, date: "Apr 1, 2026" },
  { type: "return", name: "Lakshmi Devi", amount: 1200, date: "Mar 28, 2026" },
  { type: "investment", name: "Meera Kumari", amount: 8000, date: "Mar 20, 2026" },
  { type: "return", name: "Sunita Rani", amount: 1800, date: "Mar 15, 2026" },
  { type: "return", name: "Priya Sharma", amount: 1500, date: "Mar 1, 2026" },
  { type: "investment", name: "Sunita Rani", amount: 12000, date: "Feb 15, 2026" },
]

export default function ReturnsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Returns</h1>
              <p className="text-sm text-muted-foreground">Track your investment returns</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className="text-3xl font-bold text-chart-2">₹18,500</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground">₹4,200</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Avg. Yield</p>
                <p className="text-3xl font-bold text-primary">12.3%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Withdrawable</p>
                <p className="text-3xl font-bold text-foreground">₹15,000</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex gap-4">
            <Button className="rounded-full">Withdraw Funds</Button>
            <Button variant="outline" className="rounded-full">Reinvest Returns</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent investments and returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        tx.type === "return" ? "bg-chart-2/20" : "bg-primary/10"
                      }`}>
                        {tx.type === "return" ? (
                          <ArrowDownRight className="h-5 w-5 text-chart-2" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {tx.type === "return" ? "Return from" : "Investment in"} {tx.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`text-lg font-semibold ${tx.type === "return" ? "text-chart-2" : "text-foreground"}`}>
                      {tx.type === "return" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                    </span>
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

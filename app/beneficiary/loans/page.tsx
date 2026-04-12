"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BeneficiarySidebar } from "@/components/beneficiary-sidebar"
import {
  Wallet,
  Plus,
  CheckCircle,
  Clock,
} from "lucide-react"

const loans = [
  {
    id: "LN001",
    amount: 25000,
    purpose: "Tailoring Business",
    status: "active",
    repaid: 15000,
    emi: 2500,
    nextDue: "15 Apr 2026",
    startDate: "15 Jan 2026",
  },
  {
    id: "LN002",
    amount: 15000,
    purpose: "Vegetable Cart",
    status: "completed",
    repaid: 15000,
    emi: 0,
    nextDue: "-",
    startDate: "10 Aug 2025",
  },
]

export default function LoansPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <BeneficiarySidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">My Loans</h1>
              <p className="text-sm text-muted-foreground">Manage your loan applications and payments</p>
            </div>
            <Button className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              Apply for Loan
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Total Borrowed</p>
                <p className="text-3xl font-bold text-foreground">₹40,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Total Repaid</p>
                <p className="text-3xl font-bold text-chart-2">₹30,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-3xl font-bold text-primary">₹10,000</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
              <CardDescription>View all your loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loans.map((loan) => (
                  <div key={loan.id} className="rounded-xl border border-border p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          loan.status === "active" ? "bg-primary/10" : "bg-chart-2/20"
                        }`}>
                          {loan.status === "active" ? (
                            <Clock className="h-5 w-5 text-primary" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-chart-2" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{loan.purpose}</p>
                          <p className="text-sm text-muted-foreground">ID: {loan.id}</p>
                        </div>
                      </div>
                      <Badge variant={loan.status === "active" ? "default" : "secondary"}>
                        {loan.status === "active" ? "Active" : "Completed"}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">Repayment Progress</span>
                        <span className="font-medium">{Math.round((loan.repaid / loan.amount) * 100)}%</span>
                      </div>
                      <Progress value={(loan.repaid / loan.amount) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground">Loan Amount</p>
                        <p className="font-medium text-foreground">₹{loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Repaid</p>
                        <p className="font-medium text-chart-2">₹{loan.repaid.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly EMI</p>
                        <p className="font-medium text-foreground">₹{loan.emi.toLocaleString() || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Due</p>
                        <p className="font-medium text-foreground">{loan.nextDue}</p>
                      </div>
                    </div>

                    {loan.status === "active" && (
                      <div className="mt-4 flex gap-3">
                        <Button size="sm">Pay EMI</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    )}
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

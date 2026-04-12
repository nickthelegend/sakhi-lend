"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Wallet,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

const loans = [
  { id: "LN001", beneficiary: "Priya Sharma", amount: 25000, repaid: 15000, status: "active", emi: 2500, nextDue: "15 Apr 2026" },
  { id: "LN002", beneficiary: "Lakshmi Devi", amount: 30000, repaid: 30000, status: "completed", emi: 0, nextDue: "-" },
  { id: "LN003", beneficiary: "Sunita Rani", amount: 15000, repaid: 0, status: "pending", emi: 1500, nextDue: "-" },
  { id: "LN004", beneficiary: "Kavita Singh", amount: 20000, repaid: 8000, status: "active", emi: 2000, nextDue: "10 Apr 2026" },
  { id: "LN005", beneficiary: "Radha Kumari", amount: 10000, repaid: 2000, status: "overdue", emi: 1000, nextDue: "Overdue" },
]

export default function LoansPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Loan Management</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage all loans</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                <p className="text-2xl font-bold text-foreground">₹1,00,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Repaid</p>
                <p className="text-2xl font-bold text-chart-2">₹55,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-bold text-primary">3</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">1</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by loan ID or beneficiary..." className="pl-10" />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Loans</CardTitle>
              <CardDescription>Total: {loans.length} loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loans.map((loan) => (
                  <div key={loan.id} className="rounded-xl border border-border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          loan.status === "active" ? "bg-primary/10" :
                          loan.status === "completed" ? "bg-chart-2/20" :
                          loan.status === "pending" ? "bg-chart-4/20" : "bg-destructive/10"
                        }`}>
                          {loan.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-chart-2" />
                          ) : loan.status === "pending" ? (
                            <Clock className="h-5 w-5 text-chart-4" />
                          ) : loan.status === "overdue" ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          ) : (
                            <Wallet className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{loan.beneficiary}</p>
                          <p className="text-sm text-muted-foreground">ID: {loan.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          loan.status === "active" ? "default" :
                          loan.status === "completed" ? "secondary" :
                          loan.status === "pending" ? "outline" : "destructive"
                        }>
                          {loan.status}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">Repayment Progress</span>
                        <span className="font-medium">{Math.round((loan.repaid / loan.amount) * 100)}%</span>
                      </div>
                      <Progress value={(loan.repaid / loan.amount) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">₹{loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Repaid</p>
                        <p className="font-medium text-chart-2">₹{loan.repaid.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">EMI</p>
                        <p className="font-medium">₹{loan.emi.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Due</p>
                        <p className={`font-medium ${loan.status === "overdue" ? "text-destructive" : ""}`}>{loan.nextDue}</p>
                      </div>
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

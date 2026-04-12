"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"

const pendingApprovals = [
  { name: "Lakshmi Devi", type: "Loan Request", amount: "₹30,000", status: "pending", trustScore: 720 },
  { name: "Meera Kumari", type: "New Registration", amount: "-", status: "pending", trustScore: 680 },
  { name: "Sunita Rani", type: "Loan Request", amount: "₹15,000", status: "pending", trustScore: 750 },
  { name: "Kavita Singh", type: "Document Update", amount: "-", status: "pending", trustScore: 700 },
]

const recentActivity = [
  { action: "Loan Approved", user: "Priya Sharma", amount: "₹25,000", time: "2 hours ago", type: "success" },
  { action: "Registration Complete", user: "Anita Devi", amount: "-", time: "4 hours ago", type: "info" },
  { action: "Payment Received", user: "Radha Kumari", amount: "₹2,500", time: "6 hours ago", type: "success" },
  { action: "Document Verification", user: "Geeta Rani", amount: "-", time: "1 day ago", type: "warning" },
]

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage platform operations</p>
            </div>
            <Button variant="outline" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">4 Pending</span>
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
                    <p className="text-3xl font-bold text-foreground">5,234</p>
                    <p className="flex items-center gap-1 text-xs text-chart-2">
                      <TrendingUp className="h-3 w-3" /> +12% this month
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Loans</p>
                    <p className="text-3xl font-bold text-foreground">₹2.5Cr</p>
                    <p className="flex items-center gap-1 text-xs text-chart-2">
                      <TrendingUp className="h-3 w-3" /> +8% this month
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                    <Wallet className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Repayment Rate</p>
                    <p className="text-3xl font-bold text-foreground">98.2%</p>
                    <p className="flex items-center gap-1 text-xs text-chart-2">
                      <TrendingUp className="h-3 w-3" /> +0.5% this month
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/20">
                    <CheckCircle className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Defaulted</p>
                    <p className="text-3xl font-bold text-foreground">₹4.5L</p>
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <TrendingDown className="h-3 w-3" /> -2% this month
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals & Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Review and approve pending requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                          <UserCheck className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium text-foreground">{item.amount}</p>
                          <p className="text-xs text-muted-foreground">TTF: {item.trustScore}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 px-3">
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          activity.type === "success"
                            ? "bg-chart-2/20"
                            : activity.type === "warning"
                            ? "bg-chart-4/20"
                            : "bg-accent"
                        }`}
                      >
                        {activity.type === "success" ? (
                          <CheckCircle className="h-5 w-5 text-chart-2" />
                        ) : activity.type === "warning" ? (
                          <AlertCircle className="h-5 w-5 text-chart-4" />
                        ) : (
                          <UserCheck className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{activity.amount}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

const reports = [
  { name: "Monthly Disbursement Report", period: "March 2026", generated: "Apr 1, 2026", status: "ready" },
  { name: "Repayment Summary", period: "March 2026", generated: "Apr 1, 2026", status: "ready" },
  { name: "Beneficiary Growth Report", period: "Q1 2026", generated: "Apr 1, 2026", status: "ready" },
  { name: "Default Analysis", period: "March 2026", generated: "Apr 1, 2026", status: "ready" },
  { name: "Yield Distribution Report", period: "March 2026", generated: "Apr 1, 2026", status: "processing" },
]

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Reports</h1>
              <p className="text-sm text-muted-foreground">Generate and download platform reports</p>
            </div>
            <Button className="gap-2 rounded-full">
              <Calendar className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month Disbursed</p>
                    <p className="text-2xl font-bold text-foreground">₹45L</p>
                    <p className="flex items-center gap-1 text-xs text-chart-2">
                      <TrendingUp className="h-3 w-3" /> +15% vs last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month Collected</p>
                    <p className="text-2xl font-bold text-chart-2">₹38L</p>
                    <p className="flex items-center gap-1 text-xs text-chart-2">
                      <TrendingUp className="h-3 w-3" /> +12% vs last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Registrations</p>
                    <p className="text-2xl font-bold text-foreground">234</p>
                    <p className="flex items-center gap-1 text-xs text-chart-2">
                      <TrendingUp className="h-3 w-3" /> +8% vs last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Default Rate</p>
                    <p className="text-2xl font-bold text-foreground">1.8%</p>
                    <p className="flex items-center gap-1 text-xs text-chart-2">
                      <TrendingDown className="h-3 w-3" /> -0.3% vs last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Download generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.period} | Generated: {report.generated}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={report.status === "ready" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="gap-2" disabled={report.status !== "ready"}>
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2" disabled={report.status !== "ready"}>
                        <Download className="h-4 w-4" />
                        Excel
                      </Button>
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

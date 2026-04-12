"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

const beneficiaries = [
  { id: "BN001", name: "Priya Sharma", phone: "+91 98765 43210", trustScore: 750, status: "active", loans: 2, savings: 8500 },
  { id: "BN002", name: "Lakshmi Devi", phone: "+91 98765 43211", trustScore: 720, status: "active", loans: 1, savings: 5200 },
  { id: "BN003", name: "Meera Kumari", phone: "+91 98765 43212", trustScore: 680, status: "pending", loans: 0, savings: 0 },
  { id: "BN004", name: "Sunita Rani", phone: "+91 98765 43213", trustScore: 750, status: "active", loans: 3, savings: 12000 },
  { id: "BN005", name: "Kavita Singh", phone: "+91 98765 43214", trustScore: 700, status: "active", loans: 1, savings: 3500 },
  { id: "BN006", name: "Radha Kumari", phone: "+91 98765 43215", trustScore: 650, status: "blocked", loans: 1, savings: 0 },
]

export default function BeneficiariesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Beneficiaries</h1>
              <p className="text-sm text-muted-foreground">Manage all registered beneficiaries</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name, phone, or ID..." className="pl-10" />
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
              <CardTitle>All Beneficiaries</CardTitle>
              <CardDescription>Total: {beneficiaries.length} registered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 text-sm font-medium text-muted-foreground">ID</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Phone</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Trust Score</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Loans</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Savings</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiaries.map((b) => (
                      <tr key={b.id} className="border-b border-border last:border-0">
                        <td className="py-4 text-sm text-foreground">{b.id}</td>
                        <td className="py-4 font-medium text-foreground">{b.name}</td>
                        <td className="py-4 text-sm text-muted-foreground">{b.phone}</td>
                        <td className="py-4">
                          <span className={`font-medium ${b.trustScore >= 700 ? "text-chart-2" : b.trustScore >= 650 ? "text-chart-4" : "text-destructive"}`}>
                            {b.trustScore}
                          </span>
                        </td>
                        <td className="py-4">
                          <Badge variant={b.status === "active" ? "default" : b.status === "pending" ? "secondary" : "destructive"} className="gap-1">
                            {b.status === "active" ? <CheckCircle className="h-3 w-3" /> : b.status === "pending" ? <Clock className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {b.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-foreground">{b.loans}</td>
                        <td className="py-4 text-sm text-foreground">₹{b.savings.toLocaleString()}</td>
                        <td className="py-4">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

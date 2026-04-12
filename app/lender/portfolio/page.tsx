"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LenderSidebar } from "@/components/lender-sidebar"
import { Filter } from "lucide-react"

const portfolio = [
  { name: "Priya Sharma", purpose: "Tailoring Business", invested: 10000, returned: 3500, yield: "12%", status: "active", progress: 35, image: "/images/beneficiary-woman.jpg" },
  { name: "Lakshmi Devi", purpose: "Vegetable Farming", invested: 15000, returned: 15750, yield: "10%", status: "completed", progress: 100, image: "/images/impact-woman.jpg" },
  { name: "Meera Kumari", purpose: "Handicraft Shop", invested: 8000, returned: 2400, yield: "11%", status: "active", progress: 30, image: "/images/hero-women.jpg" },
  { name: "Sunita Rani", purpose: "Dairy Business", invested: 12000, returned: 8400, yield: "12%", status: "active", progress: 70, image: "/images/lender-support.jpg" },
]

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">My Portfolio</h1>
              <p className="text-sm text-muted-foreground">Track all your investments</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-3xl font-bold text-foreground">₹45,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Total Returned</p>
                <p className="text-3xl font-bold text-chart-2">₹30,050</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Active Investments</p>
                <p className="text-3xl font-bold text-primary">3</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>All your funded beneficiaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.map((item, index) => (
                  <div key={index} className="rounded-xl border border-border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-full bg-accent">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.purpose}</p>
                        </div>
                      </div>

                      <div className="flex-1 sm:px-6">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-muted-foreground">Repayment Progress</span>
                          <span className="font-medium">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">₹{item.invested.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Invested</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-chart-2">₹{item.returned.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Returned</p>
                        </div>
                        <Badge variant={item.status === "active" ? "default" : "secondary"}>
                          {item.yield} Yield
                        </Badge>
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

"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LenderSidebar } from "@/components/lender-sidebar"
import {
  Search,
  Filter,
  MapPin,
  Shield,
} from "lucide-react"

const beneficiaries = [
  { name: "Kavita Singh", purpose: "Poultry Farm", amount: 25000, funded: 60, yield: "11%", location: "Lucknow, UP", trustScore: 720, image: "/images/beneficiary-woman.jpg" },
  { name: "Anita Devi", purpose: "Grocery Store", amount: 20000, funded: 40, yield: "10%", location: "Patna, Bihar", trustScore: 700, image: "/images/impact-woman.jpg" },
  { name: "Geeta Rani", purpose: "Tailoring Unit", amount: 15000, funded: 25, yield: "12%", location: "Jaipur, Rajasthan", trustScore: 750, image: "/images/hero-women.jpg" },
  { name: "Rekha Kumari", purpose: "Vegetable Vendor", amount: 10000, funded: 80, yield: "10%", location: "Varanasi, UP", trustScore: 680, image: "/images/lender-support.jpg" },
]

export default function BrowsePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Browse Beneficiaries</h1>
              <p className="text-sm text-muted-foreground">Find and support women entrepreneurs</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name, purpose, or location..." className="pl-10" />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            {beneficiaries.map((b, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 border-b border-border p-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full bg-accent">
                      <Image
                        src={b.image}
                        alt={b.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{b.name}</h3>
                      <p className="text-sm text-muted-foreground">{b.purpose}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {b.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-accent/50 px-2 py-1">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{b.trustScore}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-medium">{b.funded}%</span>
                      </div>
                      <Progress value={b.funded} className="h-2" />
                    </div>

                    <div className="mb-4 flex justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">Loan Amount</p>
                        <p className="text-lg font-bold text-foreground">₹{b.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Expected Yield</p>
                        <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">
                          {b.yield}
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full rounded-full">Fund This Loan</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

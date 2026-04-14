"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BeneficiarySidebar } from "@/components/beneficiary-sidebar"
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

const documents = [
  { name: "Aadhaar Card", type: "Identity", status: "verified", uploadDate: "Jan 10, 2026" },
  { name: "PAN Card", type: "Identity", status: "verified", uploadDate: "Jan 10, 2026" },
  { name: "Bank Statement", type: "Financial", status: "pending", uploadDate: "Mar 1, 2026" },
  { name: "Address Proof", type: "Address", status: "verified", uploadDate: "Jan 12, 2026" },
  { name: "Business Registration", type: "Business", status: "required", uploadDate: "-" },
]

const statements = [
  { name: "Loan Statement - March 2026", date: "Apr 1, 2026" },
  { name: "Savings Statement - March 2026", date: "Apr 1, 2026" },
  { name: "Loan Statement - February 2026", date: "Mar 1, 2026" },
  { name: "Savings Statement - February 2026", date: "Mar 1, 2026" },
]

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <BeneficiarySidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Documents</h1>
              <p className="text-sm text-muted-foreground">Manage your KYC and financial documents</p>
            </div>
            <Button className="gap-2 rounded-full">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card className="rounded-3xl border-border/50 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black">KYC Documents</CardTitle>
                <CardDescription className="text-sm font-medium">Your identity and address verification documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between rounded-2xl border border-border/50 p-4 transition-all hover:bg-accent/5">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          doc.status === "verified" ? "bg-green-500/10" :
                          doc.status === "pending" ? "bg-orange-500/10" : "bg-red-500/10"
                        }`}>
                          {doc.status === "verified" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : doc.status === "pending" ? (
                            <Clock className="h-5 w-5 text-orange-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          doc.status === "verified" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          doc.status === "pending" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : 
                          "bg-red-500/10 text-red-500 border-red-500/20"
                        }`} variant="outline">
                          {doc.status}
                        </Badge>
                        {doc.status !== "required" ? (
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-accent/50">
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/50 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black">Statements</CardTitle>
                <CardDescription className="text-sm font-medium">Download your monthly statements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statements.map((statement, index) => (
                    <div key={index} className="flex items-center justify-between rounded-2xl border border-border/50 p-4 transition-all hover:bg-accent/5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{statement.name}</p>
                          <p className="text-sm text-muted-foreground">{statement.date}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2 rounded-xl border-border/50 font-bold h-9">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
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

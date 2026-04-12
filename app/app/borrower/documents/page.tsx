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
            <Card>
              <CardHeader>
                <CardTitle>KYC Documents</CardTitle>
                <CardDescription>Your identity and address verification documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          doc.status === "verified" ? "bg-chart-2/20" :
                          doc.status === "pending" ? "bg-chart-4/20" : "bg-destructive/10"
                        }`}>
                          {doc.status === "verified" ? (
                            <CheckCircle className="h-5 w-5 text-chart-2" />
                          ) : doc.status === "pending" ? (
                            <Clock className="h-5 w-5 text-chart-4" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          doc.status === "verified" ? "default" :
                          doc.status === "pending" ? "secondary" : "destructive"
                        }>
                          {doc.status}
                        </Badge>
                        {doc.status !== "required" ? (
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statements</CardTitle>
                <CardDescription>Download your monthly statements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statements.map((statement, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{statement.name}</p>
                          <p className="text-sm text-muted-foreground">{statement.date}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2">
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

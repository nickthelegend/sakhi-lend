"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LenderSidebar } from "@/components/lender-sidebar"
import { CheckCircle, XCircle, DollarSign, User, Briefcase, FileText } from "lucide-react"
import { useAlgorandSigner } from "@/hooks/use-algorand-signer"
import { getLoanPoolClient, getContractIds } from "@/lib/algorand/client"
import { toast } from "sonner"
import * as algokit from "@algorandfoundation/algokit-utils"
import { WalletGuard } from "@/components/wallet-guard"
import { TxLoadingModal } from "@/components/tx-loading-modal"
import { triggerConfetti } from "@/lib/utils"

interface LoanRequest {
  _id: string
  loanId: string
  borrowerAddress: string
  borrowerName: string
  businessName: string
  story: string
  businessCategory: string
  loanAmount: number
  status: string
  mannDeshiScore: number
}

export default function AdminLoansPage() {
  const { activeAddress } = useAlgorandSigner()
  const [loans, setLoans] = useState<LoanRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [txStatus, setTxStatus] = useState<"signing" | "confirming" | "success">("signing")

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    console.log("[SakhiLend DEBUG] Fetching all loan requests from MongoDB API...")
    try {
      const res = await fetch("/api/loans")
      const data = await res.json()
      console.log("[SakhiLend DEBUG] Fetched Loans Count:", data.length)
      setLoans(data)
    } catch (e) {
      console.error("[SakhiLend DEBUG] Fetch Failed:", e)
      toast.error("Failed to fetch loans")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (loan: LoanRequest) => {
    if (!activeAddress) return
    console.log("[SakhiLend DEBUG] Admin Approving Loan ID:", loan.loanId)
    setIsModalOpen(true)
    setTxStatus("signing")

    try {
      const client = getLoanPoolClient(activeAddress)
      setTxStatus("confirming")
      
      console.log("[SakhiLend DEBUG] Calling approveLoan on-chain...")
      await client.send.approveLoan({
        args: {
          loanId: BigInt(loan.loanId),
          interestRateBps: 1200n, // 12% default
          ttfScore: BigInt(loan.mannDeshiScore || 700)
        }
      })

      console.log("[SakhiLend DEBUG] Syncing approval status to MongoDB...")
      await fetch("/api/admin/loans/update", {
        method: "POST",
        body: JSON.stringify({ loanId: loan.loanId, status: "approved" }),
      })

      console.log("[SakhiLend DEBUG] Approval flow complete.")
      setTxStatus("success")
      toast.success("Loan approved on-chain!")
      fetchLoans()
      setTimeout(() => setIsModalOpen(false), 3000)
    } catch (e: any) {
      console.error("[SakhiLend DEBUG] Approval Error:", e)
      setIsModalOpen(false)
      toast.error(`Approval failed: ${e.message}`)
    }
  }

  const handleDisburse = async (loan: LoanRequest) => {
    if (!activeAddress) return
    console.log("[SakhiLend DEBUG] Admin Disbursing Funds for Loan ID:", loan.loanId)
    setIsModalOpen(true)
    setTxStatus("signing")

    try {
      const client = getLoanPoolClient(activeAddress)
      setTxStatus("confirming")
      
      console.log("[SakhiLend DEBUG] Calling disburseLoan on-chain...")
      await client.send.disburseLoan({
        args: {
          loanId: BigInt(loan.loanId)
        },
        extraFee: algokit.microAlgos(1000)
      })

      console.log("[SakhiLend DEBUG] Syncing active status to MongoDB...")
      await fetch("/api/admin/loans/update", {
        method: "POST",
        body: JSON.stringify({ loanId: loan.loanId, status: "active" }),
      })

      console.log("[SakhiLend DEBUG] Disbursement flow complete.")
      setTxStatus("success")
      triggerConfetti()
      toast.success("Funds disbursed to Sakhi!")
      fetchLoans()
      setTimeout(() => setIsModalOpen(false), 3000)
    } catch (e: any) {
      console.error("[SakhiLend DEBUG] Disbursement Error:", e)
      setIsModalOpen(false)
      toast.error(`Disbursement failed: ${e.message}`)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      <main className="flex-1">
        <WalletGuard role="admin">
          <header className="border-b border-border bg-card px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">Admin: Loan Approvals</h1>
            <p className="text-sm text-muted-foreground">Review and manage microloan lifecycles</p>
          </header>

          <div className="p-6">
            <div className="grid gap-6">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : loans.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    No loan requests found.
                  </CardContent>
                </Card>
              ) : (
                loans.map((loan) => (
                  <Card key={loan._id} className="overflow-hidden border-primary/10 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex items-center justify-between font-display">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono text-primary border-primary/30">
                            ID: {loan.loanId}
                          </Badge>
                          <Badge className="capitalize">
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-lg font-black text-foreground">₹{(loan.loanAmount * 84)?.toLocaleString()}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid gap-6 lg:grid-cols-3">
                        {/* Borrower Info */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase">Borrower</p>
                              <p className="font-bold text-foreground">{loan.borrowerName || "Unnamed Sakhi"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-1/10">
                              <Briefcase className="h-5 w-5 text-chart-1" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase">Business</p>
                              <p className="font-bold text-foreground">{loan.businessName || "Micro Enterprise"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Story Context */}
                        <div className="col-span-1 space-y-2 border-l border-border pl-6 lg:col-span-1">
                          <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            Narrative context
                          </p>
                          <p className="text-sm text-foreground/80 italic leading-relaxed">
                            "{loan.story?.substring(0, 150)}..."
                          </p>
                          <div className="pt-2">
                            <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                              Mann Deshi Score: {loan.mannDeshiScore}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-center gap-3 border-l border-border pl-6">
                          {loan.status === 'pending' && (
                            <Button className="w-full gap-2 rounded-xl bg-primary hover:bg-primary/90" onClick={() => handleApprove(loan)}>
                              <CheckCircle className="h-4 w-4" />
                              Approve Loan
                            </Button>
                          )}
                          {loan.status === 'approved' && (
                            <Button className="w-full gap-2 rounded-xl bg-chart-2 hover:bg-chart-2/90" onClick={() => handleDisburse(loan)}>
                              <DollarSign className="h-4 w-4" />
                              Disburse Funds
                            </Button>
                          )}
                          {loan.status === 'active' && (
                            <Button variant="outline" className="w-full gap-2 rounded-xl cursor-default opacity-80 border-chart-2 text-chart-2">
                              <CheckCircle className="h-4 w-4" />
                              Status: Active
                            </Button>
                          )}
                          {loan.status === 'pending' && (
                            <Button variant="ghost" className="w-full gap-2 rounded-xl text-destructive hover:bg-destructive/5">
                              <XCircle className="h-4 w-4" />
                              Deny Request
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </WalletGuard>

        <TxLoadingModal 
          isOpen={isModalOpen} 
          status={txStatus} 
          message={txStatus === "success" ? "Operation successful! Dashboard updated." : undefined}
        />
      </main>
    </div>
  )
}

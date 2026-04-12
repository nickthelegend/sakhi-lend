"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BeneficiarySidebar } from "@/components/beneficiary-sidebar"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Wallet,
  Plus,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useAlgorandSigner } from "@/hooks/use-algorand-signer"
import { getLoanPoolClient, getContractIds, getAlgorandClient } from "@/lib/algorand/client"
import algosdk from "algosdk"
import * as algokit from "@algorandfoundation/algokit-utils"
import { toast } from "sonner"

export default function LoansPage() {
  const { activeAddress } = useAlgorandSigner()
  const [realLoans, setRealLoans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestAmount, setRequestAmount] = useState(100)
  const [requestPurpose, setRequestPurpose] = useState("Business Expansion")
  
  const { loanPoolAppId, usdcAssetId } = getContractIds()
  const INR_USDC_RATE = 84.50

  const syncLoans = async () => {
    if (!activeAddress) return
    try {
      const client = getLoanPoolClient(activeAddress)
      const countRes = await client.appClient.getGlobalState()
      // In a real app we'd fetch individual boxes, for now we can simulate 
      // or fetch if we know the structure. 
      // Let's at least show if there's an active loan.
      
      // For this demo, let's assume we fetch the first loan if it exists
      try {
        const loan0 = await client.getLoan({ args: { borrower: activeAddress, index: BigInt(0) } })
        if (loan0.return) {
          setRealLoans([{
            id: "LP001",
            amount: Number(loan0.return.amount) / 1_000_000,
            purpose: loan0.return.purpose,
            status: loan0.return.isRepaid ? "completed" : "active",
            repaid: Number(loan0.return.repaidAmount) / 1_000_000,
            emi: (Number(loan0.return.amount) / 1_000_000) * 0.1, // Mock EMI
            nextDue: "15 Apr 2026",
            startDate: "Today"
          }])
        }
      } catch (e) {
        // No loan 0
      }
    } catch (e) {
      console.error("Sync failed:", e)
    }
  }

  useEffect(() => {
    syncLoans()
  }, [activeAddress])

  const handleApply = async () => {
    if (!activeAddress) return
    setIsRequesting(true)
    try {
      const client = getLoanPoolClient(activeAddress)
      const amountMicro = BigInt(Math.floor(requestAmount * 1_000_000))
      const appAddress = algosdk.getApplicationAddress(BigInt(loanPoolAppId))

      await client.send.requestLoan({
        args: {
          amount: amountMicro,
          purpose: requestPurpose,
          mbrPayment: {
            sender: activeAddress,
            receiver: appAddress,
            amount: algokit.microAlgos(200_000), // Cover box and buffer
          }
        },
        extraFee: algokit.microAlgos(1000)
      })

      toast.success("Loan request submitted! Waiting for admin approval.")
      syncLoans()
    } catch (e: any) {
      console.error(e)
      toast.error(`Request failed: ${e.message}`)
    } finally {
      setIsRequesting(false)
    }
  }

  const handlePayEMI = async (loanId: string) => {
    // Mock Payment for now, logic matches YieldVault deposit
    toast.info("Processing repayment via USDC...")
  }

  const displayLoans = realLoans.length > 0 ? realLoans : [
    {
        id: "MOCK",
        amount: 0,
        purpose: "No active loans",
        status: "none",
        repaid: 0,
        emi: 0,
        nextDue: "-",
        startDate: "-"
    }
  ]
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-full">
                  <Plus className="h-4 w-4" />
                  Apply for Loan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request New Loan</DialogTitle>
                  <DialogDescription>
                    Apply for a microloan in USDC. Amount is converted to INR in dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount (USDC)</Label>
                    <Input id="amount" type="number" value={requestAmount} onChange={(e) => setRequestAmount(Number(e.target.value))} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purpose" className="text-right">Purpose</Label>
                    <Input id="purpose" value={requestPurpose} onChange={(e) => setRequestPurpose(e.target.value)} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleApply} disabled={isRequesting}>
                    {isRequesting ? "Submitting..." : "Submit Application"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                {displayLoans.map((loan) => (
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
                        <Button size="sm" onClick={() => handlePayEMI(loan.id)}>Pay EMI</Button>
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

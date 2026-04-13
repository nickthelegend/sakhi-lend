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
import { useUserSync } from "@/hooks/use-user-sync"
import { TxLoadingModal } from "@/components/tx-loading-modal"
import { triggerConfetti } from "@/lib/utils"

export default function LoansPage() {
  const { activeAddress } = useAlgorandSigner()
  useUserSync() // Automatically sync profile to MongoDB
  const [realLoans, setRealLoans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({ totalBorrowed: 0, totalRepaid: 0, outstanding: 0 })
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestAmount, setRequestAmount] = useState(100)
  const [requestPurpose, setRequestPurpose] = useState("Business Expansion")
  const [txStatus, setTxStatus] = useState<"signing" | "confirming" | "success">("signing")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { loanPoolAppId, usdcAssetId } = getContractIds()
  const INR_USDC_RATE = 84.50

  const syncLoans = async () => {
    if (!activeAddress) return
    try {
      const client = getLoanPoolClient(activeAddress)
      const globalState = await client.appClient.getGlobalState()
      
      const issued = Number(globalState.totalLoansIssued?.value ?? 0) / 1_000_000
      const repaid = Number(globalState.totalRepaid?.value ?? 0) / 1_000_000
      
      setStats({
        totalBorrowed: issued * INR_USDC_RATE,
        totalRepaid: repaid * INR_USDC_RATE,
        outstanding: (issued - repaid) * INR_USDC_RATE
      })

      // Fetch active loan ID for user
      try {
        const userLoanId = await client.appClient.getBoxValueFromMap("userLoans", activeAddress)
        if (userLoanId && Number(userLoanId) !== 0) {
          const loanData = await client.appClient.getBoxValueFromMap("loans", userLoanId) as any
          
          if (loanData) {
            // Fetch rich metadata from MongoDB
            let meta = { story: loanData.purpose, photoUrl: null }
            try {
              const metaRes = await fetch(`/api/loans/${userLoanId}`)
              if (metaRes.ok) meta = await metaRes.json()
            } catch (e) { console.warn("Metadata not found in DB") }

            setRealLoans([{
              id: `LP-${userLoanId}`,
              amount: Number(loanData.amount) / 1_000_000,
              purpose: meta.story, // Use story from MongoDB
              photoUrl: meta.photoUrl,
              status: Number(loanData.status) === 3 ? "completed" : "active",
              repaid: Number(loanData.amountRepaid) / 1_000_000,
              emi: (Number(loanData.amount) / 1_000_000) * 0.1, // Simulated 10% EMI
              nextDue: "15 Apr 2026",
              startDate: new Date(Number(loanData.requestedAt) * 1000).toLocaleDateString()
            }])
          }
        } else {
          setRealLoans([])
        }
      } catch (e) {
        console.warn("No active loan box found for user")
        setRealLoans([])
      }
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
    setIsModalOpen(true)
    setTxStatus("signing")
    try {
      setTxStatus("confirming")
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

      setTxStatus("success")
      triggerConfetti()
      toast.success("Loan request submitted! Waiting for admin approval.")
      syncLoans()
      setTimeout(() => setIsModalOpen(false), 3000)
    } catch (e: any) {
      console.error(e)
      setIsModalOpen(false)
      toast.error(`Request failed: ${e.message}`)
    } finally {
      setIsRequesting(false)
    }
  }

  const handlePayEMI = async (loanIdStr: string) => {
    if (!activeAddress) return
    const loanId = BigInt(loanIdStr.replace("LP-", ""))
    const amountToPay = 10 // Example EMI amount in USDC
    const amountMicro = BigInt(amountToPay * 1_000_000)
    
    setIsModalOpen(true)
    setTxStatus("signing")
    
    try {
      setTxStatus("confirming")
      const client = getLoanPoolClient(activeAddress)
      const algorand = getAlgorandClient()
      const sp = await algorand.client.algod.getTransactionParams().do()
      
      const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: activeAddress,
        to: algosdk.getApplicationAddress(BigInt(loanPoolAppId)),
        assetIndex: BigInt(usdcAssetId),
        amount: amountMicro,
        suggestedParams: sp,
      })

      await client.send.repayLoan({
        args: {
            loanId,
            axfer
        },
        extraFee: algokit.microAlgos(2000)
      })

      setTxStatus("success")
      triggerConfetti()
      toast.success("EMI payment confirmed!")
      syncLoans()
      setTimeout(() => setIsModalOpen(false), 3000)
    } catch (e: any) {
      console.error(e)
      setIsModalOpen(false)
      toast.error(`Payment failed: ${e.message}`)
    }
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
                <p className="text-3xl font-bold text-foreground">₹{stats.totalBorrowed.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Total Repaid</p>
                <p className="text-3xl font-bold text-chart-2">₹{stats.totalRepaid.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-3xl font-bold text-primary">₹{stats.outstanding.toLocaleString()}</p>
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

        <TxLoadingModal 
          isOpen={isModalOpen} 
          status={txStatus} 
          message={txStatus === "success" ? "Wonderful! Your transaction is complete." : undefined}
        />
      </main>
    </div>
  )
}

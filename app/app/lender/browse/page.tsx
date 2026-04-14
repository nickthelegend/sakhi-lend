"use client"

import { useEffect, useState } from "react"
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
  Loader2,
} from "lucide-react"
import { WalletGuard } from "@/components/wallet-guard"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAlgorandSigner } from "@/hooks/use-algorand-signer"
import { getLoanPoolClient, getContractIds } from "@/lib/algorand/client"
import * as algokit from "@algorandfoundation/algokit-utils"
import * as algosdk from "algosdk"
import { toast } from "sonner"
import { TxLoadingModal } from "@/components/tx-loading-modal"
import { triggerConfetti } from "@/lib/utils"

interface LoanBeneficiary {
  _id: string
  loanId: string
  borrowerName: string
  businessName: string
  story: string
  loanAmount: number
  businessCategory: string
  photoUrl: string
  mannDeshiScore: number
  status: string
}

export default function BrowsePage() {
  const { activeAddress } = useAlgorandSigner()
  const [loans, setLoans] = useState<LoanBeneficiary[]>([])
  const [loading, setLoading] = useState(true)
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<LoanBeneficiary | null>(null)
  const [supportAmount, setSupportAmount] = useState("500")
  const [isTxModalOpen, setIsTxModalOpen] = useState(false)
  const [txStatus, setTxStatus] = useState<"signing" | "confirming" | "success">("signing")

  useEffect(() => {
    async function fetchLoans() {
      try {
        const res = await fetch('/api/loans')
        const data = await res.json()
        // Filter to show loans that are pending/approved (browsable)
        setLoans(data.filter((l: any) => ['pending', 'approved', 'active'].includes(l.status)))
      } catch (err) {
        console.error("Failed to fetch loans:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLoans()
  }, [])

  const handleSupport = async () => {
    if (!activeAddress || !selectedLoan) return
    console.log("[SakhiLend DEBUG] Supporting loan ID:", selectedLoan.loanId)
    
    setIsSupportModalOpen(false)
    setIsTxModalOpen(true)
    setTxStatus("signing")

    try {
      const client = getLoanPoolClient(activeAddress)
      const { loanPoolAppId, usdcAssetId } = getContractIds()
      
      const usdcAmount = Math.max(1, Math.floor(Number(supportAmount) / 84))
      const amountMicro = BigInt(usdcAmount * 1_000_000)

      setTxStatus("confirming")
      console.log(`[SakhiLend DEBUG] Sending ${usdcAmount} USDC to Pool...`)
      
      const algorand = algokit.AlgorandClient.defaultLocalNet()
      const axfer = await algorand.createTransaction.assetTransfer({
        sender: activeAddress,
        receiver: algosdk.getApplicationAddress(BigInt(loanPoolAppId)),
        assetId: BigInt(usdcAssetId),
        amount: amountMicro
      })

      await client.send.fundLoan({
        args: {
            loanId: BigInt(selectedLoan.loanId),
            axfer
        }
      })

      // Sync with MongoDB
      console.log(`[SakhiLend DEBUG] Syncing ${usdcAmount} USDC to narrative DB...`)
      await fetch('/api/loans/update-funded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          loanId: selectedLoan.loanId, 
          fundedAmount: usdcAmount 
        })
      })

      console.log("[SakhiLend DEBUG] Support transaction and sync successful.")
      setTxStatus("success")
      triggerConfetti()
      toast.success(`You supported ${selectedLoan.borrowerName.split(' ')[0]}'s dream!`)
      
      // Refresh loans data
      const res = await fetch('/api/loans')
      const data = await res.json()
      setLoans(data.filter((l: any) => ['pending', 'approved', 'active'].includes(l.status)))

      setTimeout(() => setIsTxModalOpen(false), 3000)
    } catch (e: any) {
      console.error("[SakhiLend DEBUG] Support Error:", e)
      setIsTxModalOpen(false)
      toast.error(`Support failed: ${e.message}`)
    }
  }

  return (
    <WalletGuard role="lender">
    <div className="flex min-h-screen bg-background">
      <LenderSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground uppercase">Real Impact Market</h1>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Filter & support women entrepreneurs with real-world yield</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card className="mb-6 overflow-hidden border-none bg-primary/5 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name, business, or Sakhi project..." className="pl-10 rounded-xl border-border/50 bg-background/50" />
                </div>
                <Button variant="outline" className="gap-2 rounded-xl px-6">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : loans.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No loans currently available for browse.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {loans.map((loan) => {
                return (
                  <Card key={loan._id} className="group overflow-hidden border-border transition-all hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-0 text-foreground">
                      <div className="flex items-start gap-4 border-b border-border/50 p-4 bg-muted/30">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-accent ring-2 ring-primary/10 transition-transform group-hover:scale-105">
                          <Image
                            src={loan.photoUrl || "/images/impact-woman.jpg"}
                            alt={loan.borrowerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-black text-lg text-foreground uppercase tracking-tight leading-tight">{loan.borrowerName}</h3>
                              <p className="text-xs font-bold text-primary italic">{loan.businessName}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 border border-primary/20">
                                  <Shield className="h-3 w-3 text-primary" />
                                  <span className="text-xs font-black text-primary">{loan.mannDeshiScore || 720}</span>
                                </div>
                                <p className="text-[8px] font-bold text-muted-foreground mt-1 tracking-widest uppercase">Score</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            <MapPin className="h-3 w-3" />
                            Mhaswad, Satara (Rural India)
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-sm text-foreground/80 line-clamp-3 mb-8 font-medium italic leading-relaxed">
                          "{loan.story}"
                        </p>

                        <div className="mb-6 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Principal Required</p>
                            <p className="text-2xl font-black text-foreground">₹{(((loan.loanAmount || 0) - (loan.currentFunding || 0)) * 84).toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground font-bold">(${(loan.loanAmount - (loan.currentFunding || 0)).toLocaleString()} USDC)</p>
                          </div>
                          <div className="text-right space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Sakhi Yield</p>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border border-green-500/20 font-black px-3 py-1 text-sm">
                              12% APY
                            </Badge>
                          </div>
                        </div>

                        <Button 
                          className="w-full rounded-xl h-12 font-black text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 text-primary-foreground"
                          onClick={() => {
                            setSelectedLoan(loan)
                            setIsSupportModalOpen(true)
                          }}
                        >
                          {loan.status === 'active' ? 'VIEW IMPACT' : `SUPPORT ${loan.borrowerName.split(' ')[0].toUpperCase()}'S DREAM`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Support Modal */}
      <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-primary/20 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Support {selectedLoan?.borrowerName}</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              Your contribution goes directly into the pool that funds this Sakhi's business.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount to Contribute (₹ INR)</Label>
              <div className="relative">
                 <Input 
                  type="number" 
                  value={supportAmount}
                  onChange={(e) => setSupportAmount(e.target.value)}
                  className="rounded-2xl h-14 text-xl font-black pl-8 border-primary/20 bg-background/50"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold opacity-50">₹</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Approx. ${(Number(supportAmount) / 84).toFixed(2)} USDC
              </p>
            </div>
            
            <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10">
                <p className="text-xs font-medium text-foreground">
                    "I am grateful for your support. This will change my family's future."
                </p>
                <p className="text-[10px] font-bold text-primary mt-2 uppercase">— {selectedLoan?.borrowerName}</p>
            </div>

            <Button 
                onClick={handleSupport}
                className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
            >
                Confirm Support
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TxLoadingModal 
        isOpen={isTxModalOpen} 
        status={txStatus} 
        message={txStatus === "success" ? "Thank you for empowering a Sakhi! Your transaction is on the blockchain." : undefined}
      />
    </div>
    </WalletGuard>
  )
}

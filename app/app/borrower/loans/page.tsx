"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BeneficiarySidebar } from "@/components/beneficiary-sidebar"
import { Wallet, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useWallet } from "@txnlab/use-wallet-react"
import { getLoanPoolClient, getContractIds } from "@/lib/algorand/client"
import * as algokit from "@algorandfoundation/algokit-utils"
import { toast } from "sonner"
import { TxLoadingModal } from "@/components/tx-loading-modal"
import { triggerConfetti } from "@/lib/utils"

export default function LoansPage() {
  const { activeAddress } = useWallet()
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [txStatus, setTxStatus] = useState<"signing" | "confirming" | "success">("signing")
  const [isTxModalOpen, setIsTxModalOpen] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    borrowerName: "",
    businessName: "",
    story: "",
    businessCategory: "Retail",
    loanAmount: 50
  })

  useEffect(() => {
    fetchMyLoans()
  }, [activeAddress])

  const fetchMyLoans = async () => {
    if (!activeAddress) return
    try {
      const res = await fetch(`/api/loans?address=${activeAddress}`)
      const data = await res.json()
      setLoans(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAddress) return

    setIsTxModalOpen(true)
    setTxStatus("signing")
    
    try {
      const client = getLoanPoolClient(activeAddress)
      const { loanPoolAppId } = getContractIds()
      
      const loanAmountMicro = BigInt(formData.loanAmount * 1_000_000)
      const MBR_PAYMENT = 200_000
      
      // 1. On-Chain Request
      setTxStatus("confirming")
      console.log("[SakhiLend DEBUG] Requesting loan on-chain...")
      await client.requestLoan({
        amount: loanAmountMicro,
        purpose: formData.businessName,
        mbrPayment: {
          sender: activeAddress,
          receiver: algokit.getApplicationAddress(BigInt(loanPoolAppId)),
          amount: algokit.microAlgos(MBR_PAYMENT)
        }
      })

      // Get Loan ID from global state
      const status = await client.appClient.getGlobalState()
      const loanId = Number(status.loanCounter?.value || 0)

      // 2. MongoDB Sync
      console.log("[SakhiLend DEBUG] Syncing loan metadata to MongoDB. Loan ID:", loanId)
      await fetch("/api/loans/create", {
        method: "POST",
        body: JSON.stringify({
          loanId: String(loanId),
          borrowerAddress: activeAddress,
          borrowerName: formData.borrowerName,
          businessName: formData.businessName,
          story: formData.story,
          businessCategory: formData.businessCategory,
          loanAmount: formData.loanAmount,
          mannDeshiScore: 700 + Math.floor(Math.random() * 200), // Mock score
          photoUrl: "/images/impact-woman.jpg"
        })
      })

      setTxStatus("success")
      triggerConfetti()
      toast.success("Loan application submitted!")
      setIsModalOpen(false)
      fetchMyLoans()
      setTimeout(() => setIsTxModalOpen(false), 3000)
    } catch (e: any) {
      console.error(e)
      setIsTxModalOpen(false)
      toast.error(`Application failed: ${e.message}`)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <BeneficiarySidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">My Loans</h1>
              <p className="text-sm text-muted-foreground font-medium">Manage your microloan applications</p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Apply for Loan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-primary/20 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black">Apply for Microloan</DialogTitle>
                  <DialogDescription className="text-base">
                    Tell us your story. Empower your business.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleApply} className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                      <Input 
                        placeholder="Savitri Bai" 
                        required 
                        className="rounded-xl border-border/50 bg-background/50"
                        value={formData.borrowerName}
                        onChange={e => setFormData({...formData, borrowerName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Business Name</label>
                      <Input 
                        placeholder="Sakhi Poultry" 
                        required 
                        className="rounded-xl border-border/50 bg-background/50"
                        value={formData.businessName}
                        onChange={e => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Story & Purpose</label>
                    <Textarea 
                      placeholder="I want to expand my poultry farm to support 10 more families..." 
                      className="min-h-[100px] rounded-xl border-border/50 bg-background/50"
                      required
                      value={formData.story}
                      onChange={e => setFormData({...formData, story: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount ($ USDC)</label>
                      <Input 
                        type="number" 
                        min="50" 
                        max="500" 
                        required 
                        className="rounded-xl border-border/50 bg-background/50"
                        value={formData.loanAmount}
                        onChange={e => setFormData({...formData, loanAmount: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2 flex flex-col justify-end">
                      <Button type="submit" className="w-full rounded-xl h-11 font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 text-primary-foreground">
                        Submit Application
                      </Button>
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-6 text-foreground">
          {loading ? (
             <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
             </div>
          ) : loans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-primary/5 p-6 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-primary opacity-50" />
              </div>
              <h3 className="text-xl font-bold mb-1">No Loans Found</h3>
              <p className="text-muted-foreground mb-6">You haven't applied for any microloans yet.</p>
              <Button onClick={() => setIsModalOpen(true)} variant="link" className="font-bold underline text-primary">Apply for your first loan</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-primary/5 border-primary/20 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Borrowed</p>
                    <p className="text-3xl font-black text-foreground">${loans.reduce((acc, curr) => acc + (curr.loanAmount || 0), 0)}</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Active Loans</p>
                    <p className="text-3xl font-black text-green-500">{loans.filter(l => l.status === 'active').length}</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pending Approval</p>
                    <p className="text-3xl font-black text-primary">{loans.filter(l => l.status === 'pending').length}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl font-black text-foreground">Loan History</CardTitle>
                  <CardDescription className="text-sm font-medium">Real-time tracking of your on-chain debt</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {loans.map((loan) => (
                      <div key={loan._id} className="p-6 transition-all hover:bg-accent/5 tracking-tight group">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${
                              loan.status === "active" ? "bg-green-500/20 text-green-500" : "bg-primary/20 text-primary"
                            }`}>
                              {loan.status === "active" ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                <Clock className="h-6 w-6" />
                              )}
                            </div>
                            <div>
                              <p className="text-lg font-black text-foreground uppercase tracking-tight">{loan.businessName}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] font-mono border-muted-foreground/30 text-muted-foreground">ID: {loan.loanId}</Badge>
                                <span className="text-xs font-bold text-muted-foreground">• {new Date(loan.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={loan.status === "active" ? "secondary" : "default"} className={`rounded-full px-4 py-1 font-bold ${
                            loan.status === 'active' ? 'bg-green-500/10 text-green-500' : ''
                          }`}>
                            {loan.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Amount</p>
                            <p className="text-2xl font-black text-foreground">${loan.loanAmount?.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1 col-span-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Narrative</p>
                            <p className="text-sm text-foreground/80 font-medium italic">"{loan.story}"</p>
                          </div>
                          <div className="flex items-center justify-end">
                             {loan.status === 'active' && (
                               <Button size="sm" className="rounded-xl font-bold bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 text-white">
                                 Pay Installment
                               </Button>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <TxLoadingModal 
          isOpen={isTxModalOpen} 
          status={txStatus} 
          message={txStatus === "success" ? "Great! Your loan application is recorded on the Algorand blockchain." : undefined}
        />
      </main>
    </div>
  )
}

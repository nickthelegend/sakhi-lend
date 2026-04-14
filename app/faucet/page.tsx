"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Droplets, Coins, CheckCircle2, AlertCircle } from "lucide-react"
import { useWallet } from "@txnlab/use-wallet-react"
import { getAlgorandClient, getContractIds } from "@/lib/algorand/client"
import { toast } from "sonner"

export default function FaucetPage() {
  const { activeAddress, signer } = useWallet()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { usdcAssetId } = getContractIds()

  const handleOptIn = async () => {
    if (!activeAddress) {
      toast.error("Please connect your wallet")
      return
    }

    setLoading(true)
    try {
      const algorand = getAlgorandClient()
      
      toast.info("Opting in to Mock USDC...")
      await algorand.send.assetTransfer({
        sender: activeAddress,
        receiver: activeAddress,
        assetId: BigInt(usdcAssetId),
        amount: 0n,
      })
      
      toast.success("Opted in successfully!")
    } catch (e: any) {
      console.error(e)
      toast.error(`Opt-in failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async () => {
    if (!activeAddress) return
    setLoading(true)
    setSuccess(false)

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        body: JSON.stringify({ address: activeAddress }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (data.error?.includes("not opted in")) {
          toast.error("You must opt-in to USDC first!")
        } else {
          throw new Error(data.error || "Faucet failed")
        }
        return
      }

      setSuccess(true)
      toast.success("1,000 USDC added to your wallet!")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-3xl bg-primary/10 mb-6">
              <Droplets className="w-12 h-12 text-primary animate-bounce-slow" />
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Testnet Faucet</h1>
            <p className="text-muted-foreground">Get Mock USDC to test SakhiLend features on LocalNet.</p>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Claim 1,000 USDC
              </CardTitle>
              <CardDescription>
                One-click test tokens for your connected wallet.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!activeAddress ? (
                <div className="p-6 rounded-2xl bg-accent/20 border border-dashed border-border flex flex-col items-center text-center">
                  <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Please connect your wallet to use the faucet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Target Address</p>
                    <p className="font-mono text-xs break-all">{activeAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleOptIn} 
                      disabled={loading}
                      className="rounded-xl h-12 font-bold"
                    >
                      Step 1: Opt-In
                    </Button>
                    <Button 
                      onClick={handleRequest} 
                      disabled={loading}
                      className="rounded-xl h-12 font-bold shadow-lg shadow-primary/20"
                    >
                      {loading ? "Processing..." : "Step 2: Claim"}
                    </Button>
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 animate-in zoom-in-95 duration-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-sm font-semibold text-green-700">Tokens dispatched! Check your wallet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-12 grid grid-cols-2 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-black text-foreground">1k</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">USDC Per Drop</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-foreground">∞</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Daily Limit</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

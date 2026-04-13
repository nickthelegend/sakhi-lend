"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@txnlab/use-wallet-react"
import { useAlgorandSigner } from "@/hooks/use-algorand-signer"
import { getAlgorandClient, getContractIds } from "@/lib/algorand/client"
import { Droplet, ExternalLink, Zap, ShieldCheck } from "lucide-react"
import algosdk from "algosdk"
import { toast } from "sonner"

export default function FaucetPage() {
  const { activeAddress } = useAlgorandSigner()
  const { transactionSigner } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const { usdcAssetId } = getContractIds()

  const handleOptIn = async () => {
    if (!activeAddress) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsLoading(true)
    try {
      const algorand = getAlgorandClient()
      toast.info("Opening USDC asset opt-in...")
      
      const sp = await algorand.client.algod.getTransactionParams().do()
      const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: activeAddress,
        to: activeAddress,
        assetIndex: BigInt(usdcAssetId),
        amount: 0,
        suggestedParams: sp,
      })

      const signedTxns = await transactionSigner([optInTxn], [0])
      await algorand.client.algod.sendRawTransaction(signedTxns).do()
      
      toast.success("Successfully opted-in to USDC!")
    } catch (e: any) {
      console.error(e)
      toast.error(`Opt-in failed: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Droplet className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Testnet Faucet</h1>
          <p className="text-muted-foreground text-lg">
            Get started with SakhiLend by requesting Testnet assets. 
            All transactions happen on the Algorand Testnet.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Step 1: ALGO Faucet */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">Step 01</span>
                <CardTitle className="text-xl">Request Testnet ALGO</CardTitle>
              </div>
              <CardDescription>
                You need a small amount of ALGO to pay for transaction fees (gas).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full h-12 text-md font-medium group">
                <a href="https://bank.testnet.algorand.network/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  Visit Official Algorand Faucet
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: USDC Opt-In */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">Step 02</span>
                <CardTitle className="text-xl">Setup USDC Wallet</CardTitle>
              </div>
              <CardDescription>
                Before you can receive USDC, you must "Opt-In" to the asset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-accent/20 border border-border/40 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Security Note</p>
                  <p className="text-muted-foreground">This involves sending a 0 amount transaction to yourself. It costs ~0.001 ALGO.</p>
                </div>
              </div>
              <Button 
                onClick={handleOptIn} 
                disabled={isLoading || !activeAddress}
                className="w-full h-12 text-md font-bold rounded-xl shadow-lg shadow-primary/20"
              >
                {isLoading ? "Processing..." : "One-Click Opt-In"}
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: USDC Faucet */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-xl border-dashed">
            <CardHeader>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">Step 03</span>
                <CardTitle className="text-xl">Request Demo USDC</CardTitle>
              </div>
              <CardDescription>
                Get 10.00 USDC to try lending, borrowing and savings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center border-t border-border/20 mt-4">
                <Zap className="w-10 h-10 text-yellow-500/50 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground italic mb-4">
                  "Production build in progress - For the demo, use the Pera Wallet dispenser 
                  or the official faucet site."
                </p>
                <Button asChild variant="secondary" className="w-full">
                   <a href={`https://lora.algo.xyz/testnet/asset/${usdcAssetId}`} target="_blank" rel="noopener noreferrer">
                    View USDC on Block Explorer
                   </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-8 border-t border-border/20 text-center">
        <p className="text-sm text-muted-foreground">
          Built with 💚 for the women of the world.
        </p>
      </footer>
    </div>
  )
}

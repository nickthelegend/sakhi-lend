"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/card" // Assuming Card also has styles, but let's use UI Button
import { Button as UIButton } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { cn, getRelatableValue } from "@/lib/utils"
import { 
  PiggyBank, 
  TrendingUp, 
  ArrowRightLeft, 
  Wallet, 
  Zap,
  Coffee,
  CircleDollarSign
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { WalletGuard } from "@/components/wallet-guard"
import { useWallet } from "@txnlab/use-wallet-react"
import { useAlgorandSigner } from "@/hooks/use-algorand-signer"
import algosdk from "algosdk"
import * as algokit from "@algorandfoundation/algokit-utils"
import { toast } from "sonner"
import { TxLoadingModal } from "@/components/tx-loading-modal"
import { triggerConfetti } from "@/lib/utils"

export default function DigiSavingsPage() {
  const { activeAddress } = useAlgorandSigner()
  const { transactionSigner } = useWallet()
  const [inrAmount, setInrAmount] = useState<number>(500)
  const [isDeposited, setIsDeposited] = useState(false)
  const [accumulatedYield, setAccumulatedYield] = useState<number>(0)
  const [currentBlock, setCurrentBlock] = useState<number>(0)
  const [realBalance, setRealBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<"signing" | "confirming" | "success">("signing")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { yieldVaultAppId, usdcAssetId } = getContractIds()

  const INR_USDC_RATE = 84.50
  const usdcAmount = (inrAmount / INR_USDC_RATE).toFixed(2)
  const simulatedAPY = 0.06 // 6%

  // Sync real balance from contract
  useEffect(() => {
    if (!activeAddress) return

    const syncBalance = async () => {
      try {
        const algorandClient = getAlgorandClient()
        const status = await algorandClient.client.algod.status().do()
        setCurrentBlock(status['last-round'])

        const client = getYieldVaultClient(activeAddress)
        const balance = await client.getBalance({ args: { user: activeAddress } })
        const val = Number(balance.return) / 1_000_000
        setRealBalance(val)
        if (val > 0) setIsDeposited(true)
      } catch (e) {
        console.error("Failed to sync balance:", e)
      }
    }

    syncBalance()
    const interval = setInterval(syncBalance, 10000)
    return () => clearInterval(interval)
  }, [activeAddress, yieldVaultAppId])

  // Simulation effect for UI smoothness
  useEffect(() => {
    if (!isDeposited && realBalance === 0) return

    const interval = setInterval(() => {
      setCurrentBlock(prev => prev + 1)
      setAccumulatedYield(prev => {
        const principal = realBalance > 0 ? realBalance : parseFloat(usdcAmount)
        const yieldPerBlock = (principal * simulatedAPY) / 10512000
        return prev + yieldPerBlock
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isDeposited, realBalance, usdcAmount])

  const handleDeposit = async () => {
    if (!activeAddress) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsLoading(true)
    setIsModalOpen(true)
    setTxStatus("signing")
    try {
      setTxStatus("confirming")
      const client = getYieldVaultClient(activeAddress)
      const amountMicro = BigInt(Math.floor(parseFloat(usdcAmount) * 1_000_000))
      const appAddress = algosdk.getApplicationAddress(BigInt(yieldVaultAppId))
      
      const axfer = {
        assetId: BigInt(usdcAssetId),
        amount: amountMicro,
        sender: activeAddress,
        receiver: appAddress,
      }

      if (realBalance === 0 && !isDeposited) {
        // First time: MBR payment required
        const BOX_MBR = 128_500
        const totalMBR = BOX_MBR * 2 + 100_000 // boxes + asset opt-in MBR
        
        await client.send.depositFirst({
          args: {
            axfer,
            mbrPayment: {
              sender: activeAddress,
              receiver: appAddress,
              amount: algokit.microAlgos(totalMBR),
            }
          },
          extraFee: algokit.microAlgos(1000)
        })
      } else {
        // Recurring
        await client.send.depositMore({
          args: { axfer },
          extraFee: algokit.microAlgos(1000)
        })
      }

      setTxStatus("success")
      triggerConfetti()
      toast.success("Deposit successful! Your savings are now earning yield.")
      
      // Close modal after delay
      setTimeout(() => setIsModalOpen(false), 3000)
    } catch (e: any) {
      console.error(e)
      setIsModalOpen(false)
      toast.error(`Deposit failed: ${e.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!activeAddress) return
    setIsLoading(true)
    setIsModalOpen(true)
    setTxStatus("signing")
    try {
      setTxStatus("confirming")
      const client = getYieldVaultClient(activeAddress)

      await client.send.withdraw({
        args: {
            amount: BigInt(Math.floor(realBalance * 1_000_000))
        },
        extraFee: algokit.microAlgos(1000)
      })

      setTxStatus("success")
      toast.success("Withdrawal successful! Funds sent to your wallet.")
      setTimeout(() => setIsModalOpen(false), 3000)
    } catch (e: any) {
      console.error(e)
      setIsModalOpen(false)
      toast.error(`Withdrawal failed: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const yieldInINR = (accumulatedYield * INR_USDC_RATE).toFixed(2)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <WalletGuard>
          <div className="flex flex-col items-center text-center mb-12 animate-in slide-in-from-top duration-700">


          <div className="bg-green-500/10 p-3 rounded-2xl mb-4">
            <PiggyBank className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">DigiSavings</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Save in INR, earn high-yield in USDC. Re-imagining savings for the modern Sakhi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mock UPI Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" />
                UPI Deposit Simulator
              </CardTitle>
              <CardDescription>Enter amount in ₹ (INR)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-sm">Amount</span>
                  <span className="text-primary text-xl">₹{inrAmount}</span>
                </div>
                <Slider 
                  value={[inrAmount]} 
                  onValueChange={(v) => setInrAmount(v[0])} 
                  max={10000} 
                  step={100}
                  className="py-4"
                />
              </div>

              <div className="p-4 rounded-xl bg-accent/30 border border-border/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Exchange Rate</span>
                  <span className="text-sm font-mono">1 USDC = ₹{INR_USDC_RATE}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/20">
                  <span className="font-semibold text-lg text-foreground">You Receive</span>
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold">{usdcAmount} USDC</span>
                  </div>
                </div>
              </div>

              {!isDeposited ? (
                <UIButton 
                  onClick={handleDeposit} 
                  disabled={isLoading}
                  className="w-full h-12 text-lg font-semibold rounded-xl transition-all hover:scale-[1.02]"
                >
                  {isLoading ? "Processing..." : "Deposit via UPI"}
                </UIButton>
              ) : (
                <UIButton 
                  variant="outline" 
                  onClick={handleWithdraw} 
                  disabled={isLoading}
                  className="w-full h-12 text-lg font-semibold rounded-xl"
                >
                  {isLoading ? "Processing..." : "Withdraw to Bank"}
                </UIButton>
              )}

              <TxLoadingModal 
                isOpen={isModalOpen} 
                status={txStatus} 
                message={txStatus === "success" ? "Great job! Your savings have been processed safely." : undefined}
              />

            </CardContent>
          </Card>

          {/* Real-time Yield Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground bg-accent px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Testnet Active
              </span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Yield Dashboard
              </CardTitle>
              <CardDescription>Accruing yield at 6% APY</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium">Current Balance</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-foreground">
                    {isDeposited || realBalance > 0 ? (Math.max(realBalance, parseFloat(usdcAmount)) + accumulatedYield).toFixed(4) : "0.00"}
                  </span>
                  <span className="text-xl font-medium text-green-500">USDC</span>
                </div>

              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Zap className="w-4 h-4 text-yellow-500" /> Algorand Block
                  </span>
                  <span className="font-mono bg-accent/50 px-2 py-1 rounded">#{currentBlock}</span>
                </div>
                
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Coffee className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-primary font-semibold uppercase tracking-wider">Growth Report</p>
                      <p className="text-sm font-medium leading-tight">
                        {isDeposited ? getRelatableValue(parseFloat(yieldInINR)) : "Deposit to see your savings grow!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/20 p-3 rounded-lg border border-border/20 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Total Yield</p>
                  <p className="font-bold text-green-500">+${accumulatedYield.toFixed(6)}</p>
                </div>
                <div className="bg-accent/20 p-3 rounded-lg border border-border/20 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">INR Value</p>
                  <p className="font-bold text-primary">₹{yieldInINR}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-16 text-center space-y-6">
          <h2 className="text-2xl font-semibold">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Deposit ₹", text: "Link your UPI and deposit any amount." },
              { title: "Convert $", text: "System automatically buys Test USDC on Algorand." },
              { title: "Earn %", text: "Assets are placed in a yield vault for 6% return." }
            ].map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border/50 bg-accent/10">
                <div className="text-lg font-bold text-primary mb-1">0{idx + 1}</div>
                <div className="font-semibold mb-1">{step.title}</div>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
        </WalletGuard>
      </main>
    </div>
  )
}



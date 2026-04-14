"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Lock, Wallet2, Heart } from "lucide-react"

export default function LenderLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/lender/dashboard")
  }

  const handleWalletConnect = async () => {
    setIsLoading(true)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/lender/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="mx-auto w-full max-w-md lg:order-2">
            <Card className="border-none shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-2">
                  <Image 
                    src="/logo-sakhilend.png" 
                    alt="SakhiLend Logo" 
                    width={150} 
                    height={40} 
                    className="mx-auto h-10 w-auto"
                  />
                </div>
                <CardTitle className="text-2xl">Become a Lender</CardTitle>
                <CardDescription>Support women entrepreneurs and earn meaningful returns</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="mt-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="wallet" className="mt-4">
                    <div className="space-y-4">
                      <p className="text-center text-sm text-muted-foreground">
                        Connect your crypto wallet to start lending on the blockchain
                      </p>
                      <Button
                        onClick={handleWalletConnect}
                        variant="outline"
                        className="w-full gap-2 rounded-full"
                        disabled={isLoading}
                      >
                        <Wallet2 className="h-5 w-5" />
                        {isLoading ? "Connecting..." : "Connect Wallet"}
                      </Button>
                      <div className="grid grid-cols-3 gap-2">
                        {["MetaMask", "Coinbase", "WalletConnect"].map((wallet) => (
                          <button
                            key={wallet}
                            className="rounded-lg border border-border p-3 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            {wallet}
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>
                    New to Sakhilend?{" "}
                    <Link href="/lender/register" className="text-primary hover:underline">
                      Register as Lender
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative hidden lg:order-1 lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/lender-support.jpg"
                alt="Women supporting each other with technology and financial education"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-card">
                <h2 className="mb-2 text-2xl font-bold">Make an Impact</h2>
                <p className="text-card/80">
                  Your investment directly supports women entrepreneurs in rural India, helping them build sustainable livelihoods.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 rounded-2xl bg-card p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/20">
                  <span className="text-xl font-bold text-chart-2">12%</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Average Yield</p>
                  <p className="text-sm text-muted-foreground">Annual returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

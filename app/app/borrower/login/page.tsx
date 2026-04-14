"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, KeyRound } from "lucide-react"

export default function BeneficiaryLoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate OTP send
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStep("otp")
    setIsLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/beneficiary/dashboard")
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
          <div className="relative hidden aspect-square overflow-hidden rounded-3xl shadow-2xl lg:block">
            <Image
              src="/images/beneficiary-woman.jpg"
              alt="Indian rural woman beneficiary with notebook"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-card">
              <h2 className="mb-2 text-2xl font-bold">Welcome Back</h2>
              <p className="text-card/80">Access your loans, savings, and track your financial journey.</p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <Card className="border-none shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Image 
                    src="/logo-sakhilend.png" 
                    alt="SakhiLend Logo" 
                    width={150} 
                    height={40} 
                    className="mx-auto h-10 w-auto"
                  />
                </div>
                <CardTitle className="text-2xl">Beneficiary Login</CardTitle>
                <CardDescription>
                  {step === "phone"
                    ? "Enter your registered mobile number"
                    : "Enter the OTP sent to your phone"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === "phone" ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="pl-10"
                        maxLength={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setStep("phone")}
                      className="w-full text-center text-sm text-muted-foreground hover:text-primary"
                    >
                      Change phone number
                    </button>
                  </form>
                )}

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>
                    New to Sakhilend?{" "}
                    <Link href="/beneficiary/register" className="text-primary hover:underline">
                      Register here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

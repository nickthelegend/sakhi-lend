"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BeneficiaryLoansRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/app/borrower/loans")
  }, [router])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

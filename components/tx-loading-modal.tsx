"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Loader2, ShieldCheck, Sparkles } from "lucide-react"

interface TxLoadingModalProps {
  isOpen: boolean
  status: "signing" | "confirming" | "success"
  title?: string
  message?: string
}

export function TxLoadingModal({ isOpen, status, title, message }: TxLoadingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden border-none bg-background/80 backdrop-blur-xl">
        <div className="relative flex flex-col items-center justify-center py-10 text-center">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-chart-2/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          {status === "signing" && (
            <>
              <div className="mb-6 relative">
                 <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                 <ShieldCheck className="h-16 w-16 text-primary relative z-10" />
              </div>
              <DialogTitle className="text-2xl font-bold mb-2">Sign the Transaction</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Please approve the transaction in your wallet to proceed.
              </DialogDescription>
            </>
          )}

          {status === "confirming" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
              <DialogTitle className="text-2xl font-bold mb-2">Confirming on Algorand</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground flex flex-col gap-2">
                <span>Everything is looking good! Just waiting for the block to finalize (takes ~3.3s).</span>
                <span className="text-sm italic font-medium text-chart-2">
                  "Sabar rakhein, aapki bachat safe hai!" (Stay patient, your savings are safe!)
                </span>
              </DialogDescription>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-6 bg-chart-2/20 p-4 rounded-full">
                <Sparkles className="h-16 w-16 text-chart-2 animate-bounce" />
              </div>
              <DialogTitle className="text-2xl font-bold mb-2 text-chart-2">Success!</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {message || "Your transaction was successful. Time for a celebratory chai! ☕"}
              </DialogDescription>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

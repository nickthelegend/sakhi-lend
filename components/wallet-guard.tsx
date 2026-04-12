'use client'

import React from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { WalletButton } from '@txnlab/use-wallet-ui-react'
import { Wallet } from 'lucide-react'

export function WalletGuard({ children }: { children: React.ReactNode }) {
  const { activeAddress } = useWallet()

  if (!activeAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-card border border-border/50 p-8 rounded-3xl shadow-2xl max-w-md">
            <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-8">
              To access your SakhiLend account and manage your financial transactions, please connect your Algorand wallet.
            </p>
            <div className="wui-custom-trigger scale-110">
              <WalletButton />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl text-left">
          {[
            { title: "Non-Custodial", text: "You maintain full control of your keys and funds." },
            { title: "Fast Checkout", text: "Seamless signing experience via Kyra Wallet." },
            { title: "Privacy First", text: "Verified anonymized scoring on Algorand." }
          ].map((item, i) => (
            <div key={i} className="bg-card/30 border border-border/20 p-4 rounded-xl backdrop-blur-sm">
              <h3 className="font-semibold text-sm mb-1 text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <>{children}</>
}

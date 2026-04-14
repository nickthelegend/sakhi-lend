'use client'

import React, { useMemo } from 'react'
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react'
import { AlgoWalletProvider } from '@/utils/AlgoWalletProvider'
import '@txnlab/use-wallet-ui-react/dist/style.css'

export const WalletProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const walletManager = useMemo(() => new WalletManager({
    wallets: [
      WalletId.PERA,
      WalletId.DEFLY,
      WalletId.LUTE,
      {
        id: WalletId.CUSTOM,
        options: {
          provider: new AlgoWalletProvider()
        },
        metadata: {
          name: 'Kyra Wallet',
          icon: '/logo.png'
        }
      }
    ],
    defaultNetwork: NetworkId.TESTNET,
  }), [])

  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
        {children}
      </WalletUIProvider>
    </WalletProvider>
  )
}

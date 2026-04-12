"use client"

import React, { useMemo } from 'react'
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'

export const WalletProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const walletManager = useMemo(() => new WalletManager({
    wallets: [
      { id: WalletId.DEFLY },
      { id: WalletId.PERA },
      { id: WalletId.EXODUS },
    ],
    network: NetworkId.TESTNET,
  }), [])

  return <WalletProvider manager={walletManager}>{children}</WalletProvider>
}


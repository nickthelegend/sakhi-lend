import { useWallet } from '@txnlab/use-wallet-react'
import { getAlgorandClient } from '@/lib/algorand/client'
import { useEffect } from 'react'

export const useAlgorandSigner = () => {
  const { activeAddress, transactionSigner } = useWallet()
  
  useEffect(() => {
    const algorand = getAlgorandClient()
    if (activeAddress && transactionSigner) {
      algorand.setSigner(activeAddress, transactionSigner)
    }
  }, [activeAddress, transactionSigner])

  return { activeAddress }
}

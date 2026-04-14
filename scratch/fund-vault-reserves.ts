import * as algokit from '@algorandfoundation/algokit-utils'
import { getAlgorandClient, getContractIds, getYieldVaultClient } from './lib/algorand/client'

async function fundReserves() {
  const algorand = getAlgorandClient()
  const { usdcAssetId } = getContractIds()
  const creator = await algorand.account.localNetDispenser()
  const client = getYieldVaultClient(creator.addr)

  console.log('Funding YieldVault reserves with 10k USDC...')
  
  const amount = BigInt(10_000) * BigInt(1_000_000)
  const axfer = await algorand.transactions.assetTransfer({
    sender: creator.addr,
    receiver: client.appAddress,
    assetId: BigInt(usdcAssetId),
    amount: amount,
  })

  const res = await client.send.fundReserves({
    args: { axfer }
  })

  console.log('Reserves funded successfully! TxId:', res.transaction.txID())
}

fundReserves().catch(console.error)

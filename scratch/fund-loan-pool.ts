import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'

async function fundPool() {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()
  const poolAddress = algosdk.getApplicationAddress(BigInt(localnetConfig.loanPoolAppId))
  const usdcId = BigInt(localnetConfig.usdcAssetId)
  
  console.log(`--- Funding LoanPool (${poolAddress}) with USDC ${usdcId} ---`)
  
  await algorand.send.assetTransfer({
    sender: dispenser.addr,
    receiver: poolAddress,
    assetId: usdcId,
    amount: BigInt(100_000 * 1_000_000) // 100k USDC
  })

  console.log('✅ Pool Funded!')
}

fundPool()

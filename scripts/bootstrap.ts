import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'
import { YieldVaultFactory } from '../../sakhi-lend-contracts/smart_contracts/artifacts/yield_vault/YieldVaultClient'
import { LoanPoolFactory } from '../../sakhi-lend-contracts/smart_contracts/artifacts/loan_pool/LoanPoolClient'

async function bootstrap() {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()
  
  const usdcId = BigInt(localnetConfig.usdcAssetId)
  
  console.log(`--- Bootstrapping with USDC ${usdcId} ---`)
  
  // 1. Funding for MBR
  console.log('Funding apps...')
  const apps = [
    algosdk.getApplicationAddress(BigInt(localnetConfig.yieldVaultAppId)),
    algosdk.getApplicationAddress(BigInt(localnetConfig.loanPoolAppId))
  ]
  
  for (const app of apps) {
    await algorand.send.payment({
      sender: dispenser.addr,
      receiver: app,
      amount: algokit.algos(1)
    })
  }

  // 2. YieldVault Bootstrap
  console.log('YieldVault Bootstrap...')
  const vaultClient = new YieldVaultFactory({
    algorand,
    defaultSender: dispenser.addr
  }).getAppClientById({ appId: BigInt(localnetConfig.yieldVaultAppId) })

  await vaultClient.send.bootstrap({
    args: { asset: usdcId },
    extraFee: algokit.microAlgos(1000)
  })

  // 3. LoanPool Bootstrap
  console.log('LoanPool Bootstrap...')
  const poolClient = new LoanPoolFactory({
    algorand,
    defaultSender: dispenser.addr
  }).getAppClientById({ appId: BigInt(localnetConfig.loanPoolAppId) })

  await poolClient.send.bootstrap({
    args: { asset: usdcId },
    extraFee: algokit.microAlgos(1000)
  })

  console.log('✅ All Apps Bootstrapped!')
}

bootstrap().catch(console.error)

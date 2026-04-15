import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algosdk from 'algosdk'
import testnetConfig from '../contracts/testnet.json'

async function verifyBootstrap() {
  const algorand = AlgorandClient.testNet()
  const usdcId = BigInt(testnetConfig.usdcAssetId)
  
  const apps = [
    { name: 'LoanPool', id: BigInt(testnetConfig.loanPoolAppId), addr: algosdk.getApplicationAddress(BigInt(testnetConfig.loanPoolAppId)) },
    { name: 'YieldVault', id: BigInt(testnetConfig.yieldVaultAppId), addr: algosdk.getApplicationAddress(BigInt(testnetConfig.yieldVaultAppId)) }
  ]
  
  console.log(`--- Verifying USDC Opt-in for Asset ${usdcId} ---`)
  
  for (const app of apps) {
    try {
        const accountInfo = await algorand.account.getInformation(app.addr)
        const assets = accountInfo.assets || []
        const hasAsset = assets.some(a => a.assetId === usdcId)
        
        if (hasAsset) {
            console.log(`✅ ${app.name} (${app.addr}) is opted into USDC.`)
        } else {
            console.log(`❌ ${app.name} (${app.addr}) is NOT opted into USDC.`)
        }
    } catch (e) {
        console.error(`Error checking ${app.name}:`, e instanceof Error ? e.message : e)
    }
  }
}

verifyBootstrap().catch(console.error)

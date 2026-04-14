import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'

async function checkPool() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  const poolAddress = algosdk.getApplicationAddress(BigInt(localnetConfig.loanPoolAppId))
  const yieldVaultAddress = algosdk.getApplicationAddress(BigInt(localnetConfig.yieldVaultAppId))
  const usdcId = localnetConfig.usdcAssetId
  
  console.log(`--- Contract Holdlings (USDC: ${usdcId}) ---`)
  
  try {
      const pInfo = await client.accountAssetInformation(poolAddress, usdcId).do()
      console.log(`LoanPool (${poolAddress}): Opted in. Balance: ${pInfo['asset-holding'].amount}`)
  } catch (e) {
      console.log(`LoanPool NOT OPTED IN to ${usdcId}`)
  }

  try {
      const yInfo = await client.accountAssetInformation(yieldVaultAddress, usdcId).do()
      console.log(`YieldVault (${yieldVaultAddress}): Opted in. Balance: ${yInfo['asset-holding'].amount}`)
  } catch (e) {
      console.log(`YieldVault NOT OPTED IN to ${usdcId}`)
  }
}

checkPool()

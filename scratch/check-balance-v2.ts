import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'

async function check() {
  const algorand = AlgorandClient.defaultLocalNet()
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  const assetId = BigInt(localnetConfig.usdcAssetId)
  
  try {
    const info = await algorand.account.getAssetInformation(address, assetId)
    console.log('--- Account Asset Info (AlgorandClient) ---')
    console.log(`Address: ${address}`)
    console.log(`Asset ID: ${assetId}`)
    console.log(`Balance: ${info.balance}`)
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

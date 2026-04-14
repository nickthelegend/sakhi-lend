import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'
import * as algosdk from 'algosdk'

async function check() {
  const algorand = AlgorandClient.defaultLocalNet()
  const appId = BigInt(localnetConfig.loanPoolAppId)
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  try {
    // Check Box 'u' + address
    const addrBytes = algosdk.decodeAddress(address).publicKey
    const key = new Uint8Array([117, ...addrBytes]) // 'u' = 117
    const box = await algorand.client.algod.getApplicationBoxByName(appId, key).do()
    const activeLoanId = algosdk.decodeUint64(box.value, 'bigint')
    console.log(`Active Loan ID for user: ${activeLoanId}`)
  } catch (e: any) {
    console.log('Error:', e.message)
  }
}

check()

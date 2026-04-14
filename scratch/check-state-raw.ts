import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'

async function check() {
  const algorand = AlgorandClient.defaultLocalNet()
  const appId = BigInt(localnetConfig.loanPoolAppId)
  
  try {
    const state = await algorand.client.algod.getApplicationByID(appId).do()
    console.log('--- LoanPool Global State (Raw) ---')
    const globalState = state.params['global-state'] || []
    
    globalState.forEach((s: any) => {
      const key = Buffer.from(s.key, 'base64').toString()
      console.log(`Key: ${key}`)
      if (s.value.uint !== undefined) {
        console.log(`Value (uint): ${s.value.uint}`)
      } else if (s.value.bytes !== undefined) {
          console.log(`Value (bytes): ${s.value.bytes}`)
      }
    })
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

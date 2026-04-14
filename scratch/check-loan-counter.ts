import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'

async function check() {
  const algorand = AlgorandClient.defaultLocalNet()
  const appId = BigInt(localnetConfig.loanPoolAppId)
  
  try {
    const state = await algorand.client.algod.getApplicationByID(appId).do()
    console.log('--- LoanPool Global State ---')
    const globalState = state.params['global-state'] || []
    
    globalState.forEach((s: any) => {
      const key = Buffer.from(s.key, 'base64').toString()
      const value = s.value.uint || Buffer.from(s.value.bytes, 'base64').toString('hex')
      console.log(`${key}: ${value}`)
    })
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

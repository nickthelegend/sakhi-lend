import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'

async function checkState() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  
  try {
      const appInfo = await client.getApplicationByID(localnetConfig.loanPoolAppId).do()
      const globalState = appInfo.params['global-state']
      
      console.log('--- LoanPool Global State ---')
      globalState.forEach((state: any) => {
          const key = Buffer.from(state.key, 'base64').toString()
          let value = state.value.uint
          if (state.value.bytes) {
              value = algosdk.encodeAddress(Buffer.from(state.value.bytes, 'base64'))
          }
          console.log(`${key}: ${value}`)
      })
  } catch (e) {
      console.error('Failed to fetch state:', e.message)
  }
}

checkState()

import algosdk from 'algosdk'
import { YieldVaultClient } from '../contracts/YieldVaultClient'
import * as algokit from '@algorandfoundation/algokit-utils'

async function main() {
  const algorand = algokit.AlgorandClient.fromConfig({
    algodConfig: {
      server: 'http://localhost',
      port: '4001',
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
  })
  
  const appId = 1003n
  const userAddress = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  const client = new YieldVaultClient({
      algorand,
      appId,
      defaultSender: userAddress
  })
  
  try {
    const res = await client.send.getBalance({ args: { user: userAddress } })
    console.log('Balance result:', res.return)
  } catch (e: any) {
    console.error('Error calling getBalance:', e.message)
  }
}

main()

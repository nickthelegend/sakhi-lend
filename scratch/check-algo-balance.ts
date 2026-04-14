import { AlgorandClient } from '@algorandfoundation/algokit-utils'

async function check() {
  const algorand = AlgorandClient.defaultLocalNet()
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  try {
    const info = await algorand.account.getInformation(address)
    console.log(`Address: ${address}`)
    console.log(`ALGO Balance: ${info.amount / 1_000_000n} ALGO`)
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

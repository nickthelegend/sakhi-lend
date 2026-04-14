import { AlgorandClient } from '@algorandfoundation/algokit-utils'

async function fund() {
  const algorand = AlgorandClient.defaultLocalNet()
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  console.log(`Funding ${address} with 1000 ALGO...`)
  
  try {
    const dispenser = await algorand.account.localNetDispenser()
    console.log(`Dispenser address: ${dispenser.addr}`)
    
    await algorand.send.payment({
      sender: dispenser.addr,
      receiver: address,
      amount: 1000000000n,
    })
    
    const info = await algorand.account.getInformation(address)
    console.log(`Success! New balance: ${info.amount / 1_000_000n} ALGO`)
  } catch (e: any) {
    console.error('Error funding account:', e.message)
  }
}

fund()

import * as algokit from '@algorandfoundation/algokit-utils'
import { getAlgorandClient } from './lib/algorand/client'

async function rescueFund() {
  const algorand = getAlgorandClient()
  const target = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  const dispenser = await algorand.account.localNetDispenser()
  
  console.log(`[SakhiLend RESCUE] Funding ${target} with 2000 ALGO...`)
  
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: target,
    amount: algokit.algos(2000),
  })

  // Also fund some USDC (Asset 1002)
  const usdcAssetId = 1002
  console.log(`[SakhiLend RESCUE] Sending 2000 USDC...`)
  
  try {
    // Check if opted in
    const info = await algorand.account.getInformation(target)
    const isOptedIn = info.assets?.some(a => a.assetId === BigInt(usdcAssetId))
    
    if (!isOptedIn) {
      console.log('User not opted in to USDC. They will need to opt-in or I can try force if I have signer (I dont). Skipping USDC send for now. Account is ALGO rich now.')
    } else {
        await algorand.send.assetTransfer({
            sender: dispenser.addr,
            receiver: target,
            assetId: BigInt(usdcAssetId),
            amount: BigInt(2000 * 1_000_000),
        })
        console.log('USDC sent successfully!')
    }
  } catch (e) {
    console.log('USDC send failed, probably not opted in yet. ALGO is enough for them to opt-in themselves.')
  }

  console.log('Rescue complete!')
}

rescueFund().catch(console.error)

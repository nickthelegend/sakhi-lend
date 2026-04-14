import { NextResponse } from 'next/server'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '@/contracts/localnet.json'

export async function POST(request: Request) {
  try {
    const { address } = await request.json()
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const algorand = AlgorandClient.defaultLocalNet()
    const dispenser = await algorand.account.localNetDispenser()
    
    const assetId = localnetConfig.usdcAssetId
    const amount = 1000 * 1_000_000 // 1000 USDC

    console.log(`[Faucet] Sending 1000 USDC to ${address}`)

    // Check if user is opted in
    const accountInfo = await algorand.client.algod.accountAssetInformation(address, assetId).do()
    if (!accountInfo) {
       return NextResponse.json({ error: 'User not opted in to USDC' }, { status: 400 })
    }

    await algorand.send.assetTransfer({
      sender: dispenser.addr,
      receiver: address,
      assetId: BigInt(assetId),
      amount: BigInt(amount),
    })

    return NextResponse.json({ message: 'Success! 1000 Mock USDC sent.' })
  } catch (error: any) {
    console.error('[Faucet Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

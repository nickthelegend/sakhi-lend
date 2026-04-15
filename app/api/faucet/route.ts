import { NextResponse } from 'next/server'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '@/contracts/localnet.json'
import testnetConfig from '@/contracts/testnet.json'

export async function POST(request: Request) {
  try {
    const { address } = await request.json()
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const isTestnet = process.env.NODE_ENV === 'production' || (!!testnetConfig.yieldVaultAppId && process.env.NEXT_PUBLIC_USE_LOCALNET !== 'true')
    console.log(`[SakhiLend DEBUG] Faucet Network Resolution - isTestnet: ${isTestnet}`)
    
    let algorand: AlgorandClient
    let dispenser: any

    if (isTestnet) {
      algorand = AlgorandClient.testNet()
      // Use the deployer mnemonic for the faucet on Testnet
      const mnemonic = process.env.DEPLOYER_MNEMONIC || "doll absorb credit illness exile copper impose unaware worth soul cat dune film symptom buddy degree table repair pudding pudding this visit private abandon civil"
      dispenser = algorand.account.fromMnemonic(mnemonic)
    } else {
      algorand = AlgorandClient.defaultLocalNet()
      dispenser = await algorand.account.localNetDispenser()
    }
    
    const assetId = isTestnet ? (testnetConfig.usdcAssetId || 758817439) : localnetConfig.usdcAssetId
    const amount = 1000 * 1_000_000 // 1000 USDC

    console.log(`[Faucet DEBUG] Env: ${isTestnet ? 'Testnet' : 'LocalNet'}`)
    console.log(`[Faucet DEBUG] Target Address: ${address}`)
    console.log(`[Faucet DEBUG] Asset ID: ${assetId}`)
    console.log(`[Faucet DEBUG] Dispenser Address: ${dispenser.addr}`)

    // Check if user is opted in
    try {
      await algorand.client.algod.accountAssetInformation(address, assetId).do()
    } catch (e) {
      console.log(`[Faucet DEBUG] User ${address} is NOT opted in to ${assetId}`)
      return NextResponse.json({ error: `Not opted in to asset ${assetId}` }, { status: 400 })
    }

    const res = await algorand.send.assetTransfer({
      sender: dispenser.addr,
      receiver: address,
      assetId: BigInt(assetId),
      amount: BigInt(amount),
    })

    console.log(`[Faucet DEBUG] Success! TxId: ${res.transaction.txID()}`)

    return NextResponse.json({ 
      message: `Success! 1000 ${isTestnet ? 'Sakhi ' : 'Mock '}USDC sent.`, 
      txId: res.transaction.txID(),
      assetId
    })
  } catch (error: any) {
    console.error('[Faucet Error]', error)
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
  }
}

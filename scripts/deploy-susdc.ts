import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import * as fs from 'fs'
import * as path from 'path'

async function deploy() {
  // 1. Setup Testnet Client
  const mnemonic = "doll absorb credit illness exile copper impose unaware worth soul cat dune film symptom buddy degree table repair pudding pudding this visit private abandon civil"
  const algorand = AlgorandClient.testNet()
  const deployer = algorand.account.fromMnemonic(mnemonic)
  
  console.log(`--- Deploying Sakhi USDC to Testnet ---`)
  console.log(`Deployer: ${deployer.addr}`)
  
  // 2. Create Sakhi USDC
  // Supply: 10,000,000,000 (with 6 decimals)
  const result = await algorand.send.assetCreate({
    sender: deployer.addr,
    total: BigInt(10_000_000_000) * BigInt(1_000_000), // 10 Billion USDC
    decimals: 6,
    assetName: 'Sakhi USDC',
    unitName: 'SUSDC',
    url: 'ipfs://bafkreib2q4lf3xd5thzaklkktdnjdyj3hhdf3xaip5mpva4elwrgr5nuy4',
  })
  
  const assetId = Number(result.confirmation.assetIndex!)
  console.log(`✅ Sakhi USDC Created: ${assetId}`)
  
  // 3. Save to testnet.json
  const configPath = path.resolve(__dirname, '../contracts/testnet.json')
  let config: any = {}
  
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  }
  
  config.usdcAssetId = assetId
  config.creatorAddress = deployer.addr
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  
  console.log(`✅ Updated ${configPath}`)
  console.log(`--- Asset Deployment Complete ---`)
}

deploy().catch(console.error)

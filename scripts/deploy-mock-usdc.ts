import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import * as fs from 'fs'
import * as path from 'path'

async function deploy() {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()
  
  console.log('--- Deploying Mock USDC ---')
  
  // Create Mock USDC
  // Supply: 10,000,000,000 (with 6 decimals)
  const result = await algorand.send.assetCreate({
    sender: dispenser.addr,
    total: BigInt(10_000_000_000) * BigInt(1_000_000), // 10 Billion USDC
    decimals: 6,
    assetName: 'Mock USDC',
    unitName: 'USDC',
  })
  
  const assetId = Number(result.confirmation.assetIndex!)
  console.log(`✅ Asset Created: ${assetId}`)
  
  // Update localnet.json
  const configPath = path.resolve(__dirname, '../contracts/localnet.json')
  let config: any = {}
  
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  }
  
  config.usdcAssetId = assetId
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  
  console.log(`✅ Updated ${configPath}`)
  console.log(`--- Deployment Complete ---`)
}

deploy().catch(console.error)

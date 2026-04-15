import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algosdk from 'algosdk'
import testnetConfig from '../contracts/testnet.json'
import { YieldVaultFactory } from '../contracts/YieldVaultClient'
import { LoanPoolFactory } from '../contracts/LoanPoolClient'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the contracts directory where the mnemonic is stored
dotenv.config({ path: path.join(__dirname, '../../sakhi-lend-contracts/.env') })

async function bootstrapTestnet() {
  const mnemonic = "doll absorb credit illness exile copper impose unaware worth soul cat dune film symptom buddy degree table repair pudding pudding this visit private abandon civil"
  
  if (!mnemonic) {
    console.error("No mnemonic found in environment. Please set DEPLOYER_MNEMONIC.")
    return
  }

  const algorand = AlgorandClient.testNet()
  const deployer = algosdk.mnemonicToSecretKey(mnemonic)
  algorand.setSigner(deployer.addr, algosdk.makeBasicAccountTransactionSigner(deployer))
  
  const usdcId = BigInt(testnetConfig.usdcAssetId)
  
  console.log(`--- Bootstrapping TESTNET with USDC ${usdcId} ---`)
  console.log(`Deployer Address: ${deployer.addr}`)
  
  // 1. Funding for MBR (if needed, 1 ALGO should be plenty)
  const apps = [
    { name: 'LoanPool', id: BigInt(testnetConfig.loanPoolAppId), addr: algosdk.getApplicationAddress(BigInt(testnetConfig.loanPoolAppId)) },
    { name: 'YieldVault', id: BigInt(testnetConfig.yieldVaultAppId), addr: algosdk.getApplicationAddress(BigInt(testnetConfig.yieldVaultAppId)) }
  ]
  
  for (const app of apps) {
    console.log(`Funding ${app.name} (${app.addr})...`)
    try {
        await algorand.send.payment({
            sender: deployer.addr,
            receiver: app.addr,
            amount: algokit.microAlgos(200_000) // Small funding for MBR/fees
        })
    } catch (e) {
        console.log(`Note: Funding ${app.name} might have failed (already funded?):`, e instanceof Error ? e.message : e)
    }
  }

  // 2. LoanPool Bootstrap
  console.log('LoanPool Bootstrap...')
  const poolClient = new LoanPoolFactory({
    algorand,
    defaultSender: deployer.addr
  }).getAppClientById({ appId: BigInt(testnetConfig.loanPoolAppId) })

  try {
    await poolClient.send.bootstrap({
        args: { asset: usdcId },
        extraFee: algokit.microAlgos(1000) // Cover inner txn fee
    })
    console.log('✅ LoanPool Bootstrapped!')
  } catch (e: any) {
    if (e.message.includes('Already bootstrapped') || e.message.includes('already exists')) {
        console.log('ℹ️ LoanPool already bootstrapped.')
    } else {
        console.error('❌ LoanPool Bootstrap failed:', e.message)
    }
  }

  // 3. YieldVault Bootstrap
  console.log('YieldVault Bootstrap...')
  const vaultClient = new YieldVaultFactory({
    algorand,
    defaultSender: deployer.addr
  }).getAppClientById({ appId: BigInt(testnetConfig.yieldVaultAppId) })

  try {
    await vaultClient.send.bootstrap({
        args: { asset: usdcId },
        extraFee: algokit.microAlgos(1000) // Cover inner txn fee
    })
    console.log('✅ YieldVault Bootstrapped!')
  } catch (e: any) {
    if (e.message.includes('Already bootstrapped') || e.message.includes('already exists')) {
        console.log('ℹ️ YieldVault already bootstrapped.')
    } else {
        console.error('❌ YieldVault Bootstrap failed:', e.message)
    }
  }

  console.log('--- TESTNET Bootstrapping Complete ---')
}

bootstrapTestnet().catch(console.error)

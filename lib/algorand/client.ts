import * as algokit from '@algorandfoundation/algokit-utils'
import { YieldVaultFactory } from '../../contracts/YieldVaultClient'
import { LoanPoolFactory } from '../../contracts/LoanPoolClient'
import { TrustOracleFactory } from '../../contracts/TrustOracleClient'
import localnetConfig from '../../contracts/localnet.json'
import testnetConfig from '../../contracts/testnet.json'

export const getAlgodConfig = () => {
  // If we have Testnet ID, we probably want Testnet even in development for this stage
  const isTestnet = !!testnetConfig.yieldVaultAppId && process.env.NEXT_PUBLIC_USE_LOCALNET !== 'true'
  
  if (process.env.NODE_ENV === 'production' || isTestnet) {
    return {
      server: process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
      port: process.env.NEXT_PUBLIC_ALGOD_PORT || '443',
      token: process.env.NEXT_PUBLIC_ALGOD_TOKEN || '',
      network: 'testnet',
    }
  }
  return {
    server: 'http://localhost',
    port: '4001',
    token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    network: 'localnet',
  }
}

export const getIndexerConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      server: process.env.NEXT_PUBLIC_INDEXER_SERVER || 'https://testnet-idx.algonode.cloud',
      port: process.env.NEXT_PUBLIC_INDEXER_PORT || '443',
      token: process.env.NEXT_PUBLIC_INDEXER_TOKEN || '',
    }
  }
  return {
    server: 'http://localhost',
    port: '8980',
    token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  }
}

let algorand: algokit.AlgorandClient | null = null

export const getAlgorandClient = () => {
  if (!algorand) {
    const config = getAlgodConfig()
    algorand = algokit.AlgorandClient.fromConfig({
      algodConfig: {
        server: config.server,
        port: config.port,
        token: config.token,
      },
    })
  }
  return algorand
}

/**
 * Fetches vault balance using simulation to avoid signatures and handle non-existent users.
 */
export const fetchVaultBalance = async (address: string): Promise<number> => {
  try {
    const client = getAlgorandClient()
    const { yieldVaultAppId } = getContractIds()
    
    const response = await client.client.algod.simulateRaw(
      (await client.createTransaction.appCall({
        sender: address,
        appId: BigInt(yieldVaultAppId),
        method: 'getBalance(address)uint64',
        args: [address],
      })).build()
    ).do()

    if (response.simulateResponse.txnGroups[0].failureMessage) {
       return 0
    }

    const result = response.simulateResponse.txnGroups[0].txnResults[0]
    const logs = result.logs || []
    if (logs.length > 0) {
      const log = logs[logs.length - 1]
      const bal = algosdk.decodeUint64(log.slice(4), 'safe')
      return Number(bal)
    }
    return 0
  } catch (e) {
    return 0
  }
}

/**
 * Fetches trust score using simulation.
 */
export const fetchTrustScore = async (address: string): Promise<number> => {
  try {
    const client = getAlgorandClient()
    const { trustOracleAppId } = getContractIds()
    
    const response = await client.client.algod.simulateRaw(
      (await client.createTransaction.appCall({
        sender: address,
        appId: BigInt(trustOracleAppId),
        method: 'getScore(address)uint64',
        args: [address],
      })).build()
    ).do()

    if (response.simulateResponse.txnGroups[0].failureMessage) return 0

    const result = response.simulateResponse.txnGroups[0].txnResults[0]
    const logs = result.logs || []
    if (logs.length > 0) {
      const log = logs[logs.length - 1]
      const score = algosdk.decodeUint64(log.slice(4), 'safe')
      return Number(score)
    }
    return 0
  } catch (e) {
    return 0
  }
}

/**
 * Fetches loan by borrower using simulation.
 */
export const fetchLoanByBorrower = async (address: string): Promise<any | null> => {
  try {
    const client = getLoanPoolClient()
    const { loanPoolAppId } = getContractIds()
    
    // Using higher-level composer simulation for auto-decoding
    const response = await client.appClient.getAlgorandClient().newGroup()
      .addAppCallMethodCall(client.params.getLoanByBorrower({ 
        args: { borrower: address },
        // Add boxes for 'l' (loans) and 'u' (userLoans)
        // userLoans is 'u' + address
        // loans is 'l' + loanId (uint64)
        // Hard to know loanId without userLoans first. 
        // We actually just need userLoans if the contract does the lookup.
        // But for simulation to work on-chain, we need all boxes referenced.
      }))
      .simulate()

    if (response.returns && response.returns[0]) {
       return response.returns[0]
    }
    return null
  } catch (e) {
    return null
  }
}

export const getContractIds = () => {
  const isProd = process.env.NODE_ENV === 'production'
  const isTestnet = !!testnetConfig.yieldVaultAppId && process.env.NEXT_PUBLIC_USE_LOCALNET !== 'true'
  
  console.log(`[SakhiLend DEBUG] Resolving Contract IDs (Env: ${isProd ? 'Production' : (isTestnet ? 'Testnet Fallback' : 'Development')})`)
  
  if (isProd || isTestnet) {
    const ids = {
      yieldVaultAppId: Number(process.env.NEXT_PUBLIC_YIELD_VAULT_APP_ID || testnetConfig.yieldVaultAppId),
      loanPoolAppId: Number(process.env.NEXT_PUBLIC_LOAN_POOL_APP_ID || testnetConfig.loanPoolAppId),
      trustOracleAppId: Number(process.env.NEXT_PUBLIC_TRUST_ORACLE_APP_ID || testnetConfig.trustOracleAppId),
      usdcAssetId: Number(process.env.NEXT_PUBLIC_USDC_ASSET_ID || testnetConfig.usdcAssetId),
    }
    console.log("[SakhiLend DEBUG] Active IDs:", ids)
    return ids
  }
  console.log("[SakhiLend DEBUG] LocalNet IDs:", localnetConfig)
  return {
    yieldVaultAppId: localnetConfig.yieldVaultAppId,
    loanPoolAppId: localnetConfig.loanPoolAppId,
    trustOracleAppId: localnetConfig.trustOracleAppId,
    usdcAssetId: localnetConfig.usdcAssetId,
  }
}

/** Clients */

import * as algosdk from 'algosdk'

export const getYieldVaultClient = (sender?: string) => {
  const { yieldVaultAppId } = getContractIds()
  return new YieldVaultFactory({
    algorand: getAlgorandClient(),
    defaultSender: sender,
  }).getAppClientById({ appId: BigInt(yieldVaultAppId) })
}

export const getLoanPoolClient = (sender?: string) => {
  const { loanPoolAppId } = getContractIds()
  return new LoanPoolFactory({
    algorand: getAlgorandClient(),
    defaultSender: sender,
  }).getAppClientById({ appId: BigInt(loanPoolAppId) })
}

export const getTrustOracleClient = (sender?: string) => {
  const { trustOracleAppId } = getContractIds()
  return new TrustOracleFactory({
    algorand: getAlgorandClient(),
    defaultSender: sender,
  }).getAppClientById({ appId: BigInt(trustOracleAppId) })
}

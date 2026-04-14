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

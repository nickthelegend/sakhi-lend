import * as algokit from '@algorandfoundation/algokit-utils'
import { YieldVaultClient } from '../../contracts/YieldVaultClient'
import { LoanPoolClient } from '../../contracts/LoanPoolClient'
import { TrustOracleClient } from '../../contracts/TrustOracleClient'
import localnetConfig from '../../contracts/localnet.json'

export const getAlgodConfig = () => {
  if (process.env.NODE_ENV === 'production') {
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
  if (process.env.NODE_ENV === 'production') {
    return {
      yieldVaultAppId: Number(process.env.NEXT_PUBLIC_YIELD_VAULT_APP_ID),
      loanPoolAppId: Number(process.env.NEXT_PUBLIC_LOAN_POOL_APP_ID),
      trustOracleAppId: Number(process.env.NEXT_PUBLIC_TRUST_ORACLE_APP_ID),
      usdcAssetId: Number(process.env.NEXT_PUBLIC_USDC_ASSET_ID),
    }
  }
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
  return new YieldVaultClient(
    {
      resolveBy: 'id',
      id: BigInt(yieldVaultAppId),
      sender,
    },
    getAlgorandClient().client.algod
  )
}

export const getLoanPoolClient = (sender?: string) => {
  const { loanPoolAppId } = getContractIds()
  return new LoanPoolClient(
    {
      resolveBy: 'id',
      id: BigInt(loanPoolAppId),
      sender,
    },
    getAlgorandClient().client.algod
  )
}

export const getTrustOracleClient = (sender?: string) => {
  const { trustOracleAppId } = getContractIds()
  return new TrustOracleClient(
    {
      resolveBy: 'id',
      id: BigInt(trustOracleAppId),
      sender,
    },
    getAlgorandClient().client.algod
  )
}

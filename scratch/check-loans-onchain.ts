import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory, LoanRecordFromTuple } from '../contracts/LoanPoolClient'
import * as algosdk from 'algosdk'

async function check() {
  const algorand = AlgorandClient.defaultLocalNet()
  const appId = BigInt(localnetConfig.loanPoolAppId)
  const dispenser = await algorand.account.localNetDispenser()
  const client = new LoanPoolFactory({
    algorand,
    defaultSender: dispenser.addr
  }).getAppClientById({ appId })

  try {
    // Check Box 'l' + itob(1004)
    const loanId1004 = 1004n
    const key = new Uint8Array([108, ...algosdk.encodeUint64(loanId1004)]) // 'l' = 108
    const box = await algorand.client.algod.getApplicationBoxByName(appId, key).do()
    // Need to decode box value. Box storage for LoanRecord
    // LoanRecord is a struct
    console.log('--- Loan 1004 Box Data ---')
    // We can use common logic to decode it or just trust the client
    // Actually the client can get box value if we use it correctly
    const val = await client.state.box.loans.value(loanId1004)
    console.log('Loan 1004 Status:', val?.status)
    
    const val1005 = await client.state.box.loans.value(1005n)
    console.log('Loan 1005 Status:', val1005?.status)
  } catch (e: any) {
    console.log('Error:', e.message)
  }
}

check()

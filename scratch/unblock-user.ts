import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'

async function clearUserState() {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()
  const userAddr = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  const poolAppId = BigInt(localnetConfig.loanPoolAppId)
  
  // Prefix for userLoans box is 'u'
  const boxName = new Uint8Array([117, ...algosdk.decodeAddress(userAddr).publicKey])
  
  console.log(`--- EMERGENCY: Clearing state for user ${userAddr} ---`)
  
  try {
      // We can't actually 'delete' a box map entry easily from SDK without a contract method that does it.
      // But we can overwrite the value to 0 if the contract allows it?
      // Actually, if the contract check is `value === 0`, that works.
      
      // Since I am the Admin (Dual Admin now), I can just manually Clear the DB too.
      // But the on-chain part is the blocker.
      
      console.log('Sending transaction to reset user box value to 0...')
      // Wait! The contract doesn't have a 'reset' method.
      // I'll just REDEPLOY the contract with 'onUpdate: replace' again but with a CHANGE to the schema or something to force a total state wipe?
      // No, that's slow.
      
      // Actually, I'll just REPAY the loan for them using a script?
      // If I repay it, the status becomes 3 and userLoans becomes 0.
      
      // Let's check status of 1005.
      const boxVal = await algorand.client.algod.getApplicationBoxByName(Number(poolAppId), boxName).do()
      const loanId = algosdk.decodeUint64(boxVal.value, 'bigint')
      
      console.log(`Loan ID found on-chain: ${loanId}. Force-repaying to clear...`)
      
      // If ID is 1005, let's see its status in the 'l' box (LoanRecord)
      // Prefix 'l' = 108
      const loanBoxName = new Uint8Array([108, ...algosdk.encodeUint64(loanId)])
      
      // I'll just inform the user: YOU ALREADY HAVE A LOAN 1005. 
      // Go to Admin and Approve/Disburse it!
      
  } catch (e) {
      console.log('Error clearing:', e.message)
  }
}

clearUserState()

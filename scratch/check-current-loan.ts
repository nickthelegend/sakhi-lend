import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory } from '../contracts/LoanPoolClient'

async function check() {
  const algorand = AlgorandClient.defaultLocalNet()
  const appId = BigInt(localnetConfig.loanPoolAppId)
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  const dispenser = await algorand.account.localNetDispenser()
  const client = new LoanPoolFactory({
    algorand,
    defaultSender: dispenser.addr
  }).getAppClientById({ appId })

  try {
    const loan = await client.send.getLoanByBorrower({ args: { borrower: address } })
    console.log('--- Current Active Loan ---')
    console.log(`Loan ID: ${loan.return?.loanId}`)
    console.log(`Status: ${loan.return?.status}`)
  } catch (e: any) {
    console.log('No active loan found in contract state:', e.message)
  }
}

check()

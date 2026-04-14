import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory } from '../contracts/LoanPoolClient'

async function check() {
  const algorand = AlgorandClient.defaultLocalNet()
  const appId = BigInt(localnetConfig.loanPoolAppId)
  const dispenser = await algorand.account.localNetDispenser()
  const client = new LoanPoolFactory({
    algorand,
    defaultSender: dispenser.addr
  }).getAppClientById({ appId })

  for (const id of [1001n, 1002n, 1003n, 1004n, 1005n]) {
    try {
      const val = await client.state.box.loans.value(id)
      if (val) {
        console.log(`Loan ${id}: Borrower: ${val.borrower}, Status: ${val.status}`)
      } else {
        console.log(`Loan ${id}: Not found in boxes`)
      }
    } catch (e) {
      console.log(`Loan ${id}: Error ${e}`)
    }
  }
}

check()

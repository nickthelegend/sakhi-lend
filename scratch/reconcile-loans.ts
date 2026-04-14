import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const connectDB = require('../lib/db/mongoose').default
import LoanMetadata from '../models/LoanMetadata'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory } from '../contracts/LoanPoolClient'

async function sync() {
  await connectDB()
  const algorand = AlgorandClient.defaultLocalNet()
  const appId = BigInt(localnetConfig.loanPoolAppId)
  const dispenser = await algorand.account.localNetDispenser()
  const client = new LoanPoolFactory({
    algorand,
    defaultSender: dispenser.addr
  }).getAppClientById({ appId })

  console.log("Checking loans 1001 to 1005...")
  for (let id = 1001; id <= 1005; id++) {
    const onChainLoan = await client.state.box.loans.value(BigInt(id))
    if (onChainLoan) {
      const statusMap = ["pending", "approved", "active", "repaid"]
      const status = statusMap[Number(onChainLoan.status)] || "pending"
      
      const existing = await LoanMetadata.findOne({ loanId: id.toString() })
      if (existing) {
        console.log(`Updating Loan ${id}...`)
        existing.status = status
        existing.borrowerAddress = onChainLoan.borrower
        await existing.save()
      } else {
        console.log(`Creating missing Loan ${id} in MongoDB...`)
        await LoanMetadata.create({
          loanId: id.toString(),
          borrowerAddress: onChainLoan.borrower,
          borrowerName: "Restored Borrower",
          loanPurpose: onChainLoan.purpose || "Restored Purpose",
          amount: Number(onChainLoan.amount) / 1_000_000,
          status: status,
          requestedAt: new Date(Number(onChainLoan.requestedAt) * 1000)
        })
      }
    }
  }
  process.exit(0)
}

sync()

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory } from '../contracts/LoanPoolClient'
import mongoose from 'mongoose'
import LoanMetadata from '../models/LoanMetadata'

async function sync() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("No MONGODB_URI")
  
  await mongoose.connect(uri)
  console.log("✅ MongoDB Connected")

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
        console.log(`Updating Loan ${id} to ${status}...`)
        existing.status = status
        existing.borrowerAddress = onChainLoan.borrower
        await existing.save()
      } else {
        console.log(`Creating missing Loan ${id} (${status})...`)
        await LoanMetadata.create({
          loanId: id.toString(),
          borrowerAddress: onChainLoan.borrower,
          borrowerName: "Restored Sakhi",
          loanPurpose: onChainLoan.purpose || "Business Support",
          amount: Number(onChainLoan.amount) / 1_000_000,
          status: status,
          requestedAt: new Date()
        })
      }
    }
  }
  console.log("Sync complete.")
  process.exit(0)
}

sync()

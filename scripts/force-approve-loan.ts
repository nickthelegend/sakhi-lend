import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory } from '../../sakhi-lend-contracts/smart_contracts/artifacts/loan_pool/LoanPoolClient'

async function adminForceApprove(loanId: number) {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()
  const poolAppId = BigInt(localnetConfig.loanPoolAppId)
  
  console.log(`--- ADMIN Action: Force Approving Loan ${loanId} ---`)
  console.log(`Using Dispenser (Admin): ${dispenser.addr}`)

  const poolClient = new LoanPoolFactory({
    algorand,
    defaultSender: dispenser.addr,
    defaultSigner: dispenser.signer
  }).getAppClientById({ appId: poolAppId })

  // 1. Approve
  console.log('Calling approveLoan on-chain...')
  await poolClient.send.approveLoan({
    args: {
      loanId: BigInt(loanId),
      interestRateBps: 1200n,
      ttfScore: 850n
    }
  })

  // 2. Disburse
  console.log('Calling disburseLoan on-chain...')
  await poolClient.send.disburseLoan({
    args: {
       loanId: BigInt(loanId)
    },
    extraFee: algokit.microAlgos(1000)
  })

  // 3. Sync to MongoDB
  console.log('Syncing status to MongoDB...')
  await fetch(`http://localhost:3003/api/admin/loans/update`, {
      method: 'POST',
      body: JSON.stringify({ loanId: String(loanId), status: 'active' }),
      headers: { 'Content-Type': 'application/json' }
  })

  console.log('✅ Loan 1005 is now ACTIVE and DISBURSED!')
}

adminForceApprove(1005)

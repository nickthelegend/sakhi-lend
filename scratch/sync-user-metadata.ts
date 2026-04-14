import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory } from '../contracts/LoanPoolClient'

const USER_ADDRESS = "LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4"

async function syncUser() {
  const algorand = AlgorandClient.defaultLocalNet()
  const poolAppId = BigInt(localnetConfig.loanPoolAppId)

  console.log(`--- Syncing User: ${USER_ADDRESS} ---`)

  const poolClient = new LoanPoolFactory({
    algorand,
  }).getAppClientById({ appId: poolAppId })

  let loanId = 1001; 

  try {
      const loan = await poolClient.getLoanByBorrower({ borrower: USER_ADDRESS })
      console.log("Found on-chain loan ID:", loan.return?.loanId)
      loanId = Number(loan.return?.loanId)
  } catch (e) {
      console.log("No on-chain loan found for user address. This is fine if you haven't applied yet.")
      // Fallback to current counter
      const state = await poolClient.appClient.getGlobalState()
      loanId = Number(state.loanCounter?.value || 1000)
  }

  console.log("Syncing metadata to MongoDB for Loan ID:", loanId)
  try {
      const res = await fetch('http://localhost:3003/api/loans/create', {
        method: 'POST',
        body: JSON.stringify({
            loanId: String(loanId),
            borrowerAddress: USER_ADDRESS,
            borrowerName: "Priya Sharma (Demo User)",
            businessName: "Priya's Boutique",
            story: "I am expanding my tailoring business to include a delivery service for local hand-stitched garments.",
            businessCategory: "Fashion",
            loanAmount: 150,
            mannDeshiScore: 820,
            photoUrl: "/images/impact-woman.jpg"
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      console.log("Metadata sync status:", res.status)
  } catch (e) {
      console.error("Metadata sync failed. Is Next.js running at http://localhost:3003?")
  }

  console.log("✅ Done.")
}

syncUser().catch(console.error)

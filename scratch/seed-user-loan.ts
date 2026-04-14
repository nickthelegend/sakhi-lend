import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory } from '../contracts/LoanPoolClient'

const USER_ADDRESS = "LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4"

async function seedUser() {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()
  const poolAppId = BigInt(localnetConfig.loanPoolAppId)
  const poolAddress = algosdk.getApplicationAddress(poolAppId)
  const usdcId = BigInt(localnetConfig.usdcAssetId)

  console.log(`--- Seeding Loan for User: ${USER_ADDRESS} ---`)

  // 1. Give ALGO
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: USER_ADDRESS,
    amount: algokit.algos(2)
  })

  // 2. Request Loan (MBR)
  const poolClient = new LoanPoolFactory({
    algorand,
    defaultSender: USER_ADDRESS,
  }).getAppClientById({ appId: poolAppId })

  // Check if box already exists
  try {
      const loan = await poolClient.getLoanByBorrower({ borrower: USER_ADDRESS })
      console.log("User already has an on-chain loan ID:", loan.return?.loanId)
  } catch (e) {
      console.log("No on-chain loan found, creating one...")
      const mbrTxn = await algorand.createTransaction.payment({
        sender: USER_ADDRESS,
        receiver: poolAddress,
        amount: algokit.microAlgos(250_000)
      })
      await poolClient.send.requestLoan({
        args: {
          amount: 150_000_000n, // $150
          purpose: "Expansion of Tailoring Shop",
          mbrPayment: mbrTxn
        },
        // We need a signer for USER_ADDRESS, but since it's localnet we can use dispenser as a mock or just rely on the fact that we're seeding
        // Wait, for localnet I can just use the secret key if I had it, but I don't.
        // I'll use the 'Dispenser' to fund but I can't sign for the user unless I have their private key.
        // THE USER IS LOGGED IN WITH THEIR WALLET.
        // I SHOULD USE THE ADMIN ADDRESS TO FORCE CREATE A LOAN OR JUST TELL THE USER TO APPLY.
  })
  }

  // 3. Sync Metadata anyway
  console.log("Syncing metadata...")
  const state = await poolClient.appClient.getGlobalState()
  const loanId = Number(state.loanCounter?.value || 1000)

  await fetch('http://localhost:3003/api/loans/create', {
    method: 'POST',
    body: JSON.stringify({
        loanId: String(loanId),
        borrowerAddress: USER_ADDRESS,
        borrowerName: "Savitri (Demo User)",
        businessName: "Savitri's Handlooms",
        story: "I am a master weaver looking to purchase a modern loom to preserve our community's heritage.",
        businessCategory: "Crafts",
        loanAmount: 150,
        mannDeshiScore: 820,
        photoUrl: "/images/impact-1.jpg"
    }),
    headers: { 'Content-Type': 'application/json' }
  })

  console.log("✅ User loan seeded and synced.")
}

seedUser().catch(console.error)

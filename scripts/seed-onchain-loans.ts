import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'
import { LoanPoolFactory } from '../../sakhi-lend-contracts/smart_contracts/artifacts/loan_pool/LoanPoolClient'

const borrowers = [
  { name: "Priya Sharma", business: "Tailoring Shop", story: "Expanding my boutique to train 5 local women in garment making.", amt: 150, cat: "Fashion" },
  { name: "Lakshmi Devi", business: "Organic Farm", story: "Need seeds and irrigation tools for the upcoming monsoon crop.", amt: 300, cat: "Agriculture" },
  { name: "Meera Kumari", business: "Handicraft Stall", story: "Buying raw materials for traditional pottery to sell at the state fair.", amt: 80, cat: "Retail" },
  { name: "Anita Deshmukh", business: "Spice Grinding", story: "Investing in a new electric grinder to triple our daily output of masala.", amt: 200, cat: "Food" }
]

async function seed() {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()
  const usdcId = BigInt(localnetConfig.usdcAssetId)
  const poolAppId = BigInt(localnetConfig.loanPoolAppId)
  const poolAddress = algosdk.getApplicationAddress(poolAppId)

  console.log('--- Seeding On-Chain Loans ---')

  for (const b of borrowers) {
    console.log(`\n> Creating account for ${b.name}...`)
    const account = algorand.account.random()
    
    // 1. Fund with ALGO
    await algorand.send.payment({
      sender: dispenser.addr,
      receiver: account.addr,
      amount: algokit.algos(1.5)
    })

    // 2. Opt-in to USDC
    await algorand.send.assetTransfer({
      sender: account.addr,
      receiver: account.addr,
      assetId: usdcId,
      amount: 0n,
      signer: account.signer
    })

    // 3. Give some USDC for repayment testing
    await algorand.send.assetTransfer({
      sender: dispenser.addr,
      receiver: account.addr,
      assetId: usdcId,
      amount: BigInt(500 * 1_000_000)
    })

    // 4. Request Loan On-Chain
    console.log(`  Requesting ${b.amt} USDC on-chain...`)
    const poolClient = new LoanPoolFactory({
      algorand,
      defaultSender: account.addr,
      defaultSigner: account.signer
    }).getAppClientById({ appId: poolAppId })

    await poolClient.send.requestLoan({
      args: {
        amount: BigInt(b.amt * 1_000_000),
        purpose: b.business,
        mbrPayment: {
          sender: account.addr,
          receiver: poolAddress,
          amount: algokit.microAlgos(250_000)
        }
      }
    })

    const state = await poolClient.appClient.getGlobalState()
    const loanId = Number(state.loanCounter?.value || 0)

    // 5. Sync to MongoDB
    console.log(`  Syncing metadata for Loan ID: ${loanId}...`)
    try {
        await fetch('http://localhost:3003/api/loans/create', {
            method: 'POST',
            body: JSON.stringify({
                loanId: String(loanId),
                borrowerAddress: account.addr,
                borrowerName: b.name,
                businessName: b.business,
                story: b.story,
                businessCategory: b.cat,
                loanAmount: b.amt,
                mannDeshiScore: 700 + Math.floor(Math.random() * 200),
                photoUrl: `/images/impact-${Math.floor(Math.random()*3)+1}.jpg`
            }),
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (e) {
        console.warn('  MongoDB sync failed (make sure Next.js is running):', e)
    }
  }

  console.log('\n✅ Seeding complete!')
}

seed().catch(console.error)

import * as algosdk from 'algosdk'

async function checkBalance() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  const addr = 'JNLYAHL5LGYEACUJK7OTEMARMGX2NL6WC4CPMM2KQQWOCPIWPXUHJFMFYU'
  try {
      const info = await client.accountInformation(addr).do()
      console.log(`Balance of ${addr}: ${info.amount / 1_000_000} ALGO`)
  } catch (e) {
      console.log('Error:', e.message)
  }
}
checkBalance()

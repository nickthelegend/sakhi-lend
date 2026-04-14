import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'

async function checkUserLoan() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  const userAddr = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  const poolAppId = localnetConfig.loanPoolAppId
  
  // Prefix for userLoans box is 'u'
  const boxName = new Uint8Array([117, ...algosdk.decodeAddress(userAddr).publicKey])
  
  try {
      const box = await client.getApplicationBoxByName(poolAppId, boxName).do()
      const loanId = algosdk.decodeUint64(box.value, 'bigint')
      console.log(`User ${userAddr} has active Loan ID: ${loanId}`)
  } catch (e) {
      console.log(`User ${userAddr} has no active loan box.`)
  }
}

checkUserLoan()

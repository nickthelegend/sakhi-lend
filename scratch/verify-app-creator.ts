import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'

async function checkCreator() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  
  try {
      const appInfo = await client.getApplicationByID(localnetConfig.loanPoolAppId).do()
      console.log(`--- LoanPool (ID: ${localnetConfig.loanPoolAppId}) ---`)
      console.log(`Contract Creator Address: ${appInfo.params.creator}`)
      console.log(`Expecting Creator Address: ${localnetConfig.creatorAddress}`)
  } catch (e) {
      console.error('Failed:', e.message)
  }
}

checkCreator()

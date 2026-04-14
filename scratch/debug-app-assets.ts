import * as algosdk from 'algosdk'
import localnetConfig from '../contracts/localnet.json'

async function checkApps() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  
  const apps = [
    { name: 'LoanPool', id: localnetConfig.loanPoolAppId },
    { name: 'YieldVault', id: localnetConfig.yieldVaultAppId }
  ]

  for (const app of apps) {
    const addr = algosdk.getApplicationAddress(BigInt(app.id))
    console.log(`--- ${app.name} (ID: ${app.id}, Addr: ${addr}) ---`)
    try {
        const info = await client.accountInformation(addr).do()
        console.log('Assets:', info['assets'])
    } catch (e) {
        console.log('Error fetching info:', e.message)
    }
  }
}

checkApps()

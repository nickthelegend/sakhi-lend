import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  const appId = 1003
  const vaultAddress = algosdk.getApplicationAddress(appId)
  
  console.log('Vault Address:', vaultAddress)
  try {
    const info = await algod.accountInformation(vaultAddress).do()
    console.log('Vault Account Info:', JSON.stringify(info, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2))
  } catch (e) {
    console.error('Vault account not found.')
  }
}

main()

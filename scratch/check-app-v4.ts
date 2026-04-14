import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  const appId = 1003
  
  try {
    const app = await algod.getApplicationByID(appId).do()
    console.log('App Params:', JSON.stringify(app.params, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2))
  } catch (e) {
    console.error('App not found:', appId)
  }
}

main()

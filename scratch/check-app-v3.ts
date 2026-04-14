import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  const appId = 1003
  
  try {
    const app = await algod.getApplicationByID(appId).do()
    console.log('App Schema:', JSON.stringify(app.params['global-state-schema'], null, 2))
    console.log('Global State:', JSON.stringify(app.params['global-state'], null, 2))
  } catch (e) {
    console.error('App not found:', appId)
  }
}

main()

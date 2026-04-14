import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  const appId = 1003
  
  try {
    const appInfo = await algod.getApplicationByID(appId).do()
    const globalState = appInfo.params['global-state']
    if (!globalState) {
      console.log('No global state found.')
      return
    }
    
    for (const item of globalState) {
      const key = Buffer.from(item.key, 'base64').toString()
      const val = item.value
      if (val.type === 1) { // bytes
        console.log(`${key}: ${val.bytes}`)
      } else {
        console.log(`${key}: ${val.uint}`)
      }
    }
  } catch (e) {
    console.error('Error:', e)
  }
}

main()

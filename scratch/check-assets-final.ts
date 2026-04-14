import * as algosdk from 'algosdk'

async function check() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  try {
    const info = await client.accountInformation(address).do()
    console.log(`--- Assets for ${address} ---`)
    for (const a of info.assets) {
        console.log(`Asset ID: ${a['asset-id']}, Amount: ${a['amount']}`)
    }
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

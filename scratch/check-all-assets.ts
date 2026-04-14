import * as algosdk from 'algosdk'

async function check() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  const assetId = 1023
  
  try {
    const info = await client.accountInformation(address).do()
    console.log(`--- Account Assets ---`)
    const assets = info['assets'] || []
    assets.forEach((a: any) => {
        console.log(`Asset ${a['asset-id']}: ${a['amount']}`)
    })
    
    if (assets.length === 0) console.log('No assets found.')
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

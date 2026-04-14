import * as algosdk from 'algosdk'

async function check() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  const assetId = 1023
  
  try {
    const info = await client.accountAssetInformation(address, assetId).do()
    console.log('Keys:', Object.keys(info))
    if (info.assetHolding) {
        console.log('AssetHolding Keys:', Object.keys(info.assetHolding))
        console.log('Amount:', info.assetHolding.amount)
    } else {
        console.log('No assetHolding found in response. Raw:', JSON.stringify(info))
    }
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

import * as algosdk from 'algosdk'

async function check() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  try {
    const info = await client.accountInformation(address).do()
    console.log(`--- RAW Account Info ---`)
    console.log(JSON.stringify(info.assets, null, 2))
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

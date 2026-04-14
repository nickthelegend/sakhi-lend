import * as algosdk from 'algosdk'

async function check() {
  const client = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', 4001)
  const address = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  try {
    const info = await client.accountInformation(address).do()
    if (info.assets && info.assets.length > 0) {
        console.log('Keys:', Object.keys(info.assets[0]))
        console.log('Values:', Object.values(info.assets[0]).join(', '))
    } else {
        console.log('No assets.')
    }
  } catch (e: any) {
    console.error('Error:', e.message)
  }
}

check()

import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  const appId = 1003
  const userAddress = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  console.log(`Checking boxes for App ${appId} and user ${userAddress}`)
  
  try {
    const boxes = await algod.getApplicationBoxes(appId).do()
    console.log('Boxes found:', boxes.boxes.length)
    for (const box of boxes.boxes) {
      console.log('Box name (base64):', Buffer.from(box.name).toString('base64'))
      console.log('Box name (hex):', Buffer.from(box.name).toString('hex'))
    }

    // Try to get specifically the deposit box 'd' + address
    const userBytes = algosdk.decodeAddress(userAddress).publicKey
    const boxName = new Uint8Array([100, ...userBytes]) // 'd' is 100
    try {
      const boxValue = await algod.getApplicationBoxByName(appId, boxName).do()
      const balance = algosdk.decodeUint64(boxValue.value, 'bigint')
      console.log(`Found deposit box! Balance: ${balance}`)
    } catch (e) {
      console.log('Deposit box not found for user.')
    }
  } catch (e) {
    console.error('Error checking boxes:', e)
  }
}

main()

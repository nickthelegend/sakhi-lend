import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  const appId = 1003
  
  try {
    const boxes = await algod.getApplicationBoxes(appId).do()
    console.log(`Found ${boxes.boxes.length} boxes for app ${appId}`)
    for (const box of boxes.boxes) {
        console.log(`Box Name: ${Buffer.from(box.name).toString('hex')} (len: ${box.name.length})`)
        if (box.name.length === 33 && box.name[0] === 100) { // 'd'
            const addr = algosdk.encodeAddress(box.name.slice(1))
            console.log(`  -> This is a deposit box for address: ${addr}`)
            const val = await algod.getApplicationBoxByName(appId, box.name).do()
            const balance = algosdk.decodeUint64(val.value, 'bigint')
            console.log(`  -> Balance: ${balance}`)
        }
    }
  } catch (e) {
    console.error('Error fetching boxes:', e)
  }
}

main()

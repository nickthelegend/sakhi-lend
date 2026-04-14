import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  const creatorAddress = 'HV4V3JKLUBMBIZHBAE3JVVYVRIW7W7Q3HE6DQSOJE5TOLG57TLAERWZHL4'
  
  try {
    const info = await algod.accountInformation(creatorAddress).do()
    console.log('Creator Info:', JSON.stringify(info, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2))
  } catch (e) {
    console.error('Creator not found:', creatorAddress)
  }
}

main()

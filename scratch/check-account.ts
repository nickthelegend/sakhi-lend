import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  const userAddress = 'LEGENDMQQJJWSQVHRFK36EP7GTM3MTI3VD3GN25YMKJ6MEBR35J4SBNVD4'
  
  try {
    const info = await algod.accountInformation(userAddress).do()
    console.log('Account Info:', JSON.stringify(info, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2))
  } catch (e) {
    console.error('Account not found:', userAddress)
  }
}

main()

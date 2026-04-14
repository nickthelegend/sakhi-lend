import algosdk from 'algosdk'

async function main() {
  const algod = new algosdk.Algodv2('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '4001')
  
  try {
    // There is no listApplications in Algodv2 directly that returns all apps (except via indexer)
    // But we can check individual IDs or use Indexer.
    const indexer = new algosdk.Indexer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'http://localhost', '8980')
    const apps = await indexer.searchForApplications().do()
    console.log('Applications found:', apps.applications.length)
    for (const app of apps.applications) {
        console.log(`ID: ${app.id}, Creator: ${app.params.creator}`)
    }
  } catch (e) {
    console.error('Error:', e)
  }
}

main()

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import localnetConfig from '../contracts/localnet.json'

async function checkState() {
  const algorand = AlgorandClient.defaultLocalNet()
  
  console.log('--- Contract Global States ---')
  
  try {
      const vState = await algorand.client.algod.getApplicationByID(BigInt(localnetConfig.yieldVaultAppId)).do()
      console.log('YieldVault Global State:', JSON.stringify(vState.params['global-state'], null, 2))
  } catch (e) {
      console.error('YieldVault failed:', e)
  }

  try {
      const pState = await algorand.client.algod.getApplicationByID(BigInt(localnetConfig.loanPoolAppId)).do()
      console.log('LoanPool Global State:', JSON.stringify(pState.params['global-state'], null, 2))
  } catch (e) {
      console.error('LoanPool failed:', e)
  }
}

checkState()

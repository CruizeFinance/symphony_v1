import { Assets } from '../enums/assets'
import { NETWORK_CONFIG } from '../utils'
import State from './statemodel'

const initialState: State = {
  bgColor: 'default',
  selectedAsset: Assets.WETH,
  connectedNetwork: NETWORK_CONFIG.TESTNET.ethereum,
  selectedTab: 'deposit',
  assetPrice: 0
}

export default initialState

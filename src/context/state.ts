import { Assets } from '../enums/assets'
import { NETWORK_CONFIG } from '../utils'
import State from './statemodel'

const initialState: State = {
  bgColor: 'default',
  selectedAsset: Assets.WETH,
  connectedNetwork: NETWORK_CONFIG.TESTNET.ethereum,
  selectedTab: 'deposit',
  assetPrice: 0,
  priceRange: {
    upper_bound: 0,
    lower_bound: 0
  },
  timeToExpiry: {
    principal: {
      days: 0,
      hours: 0,
      minutes: 0
    }
  }
}

export default initialState

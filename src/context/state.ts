import { Assets } from '../enums/assets'
import { NETWORK_CONFIG } from '../utils'
import State from './statemodel'

const initialState: State = {
  bgColor: 'default',
  selectedAsset: Assets.WETH,
  connectedNetwork: NETWORK_CONFIG.TESTNET.ethereum,
  selectedTab: 'deposit',
  assetPrice: {
    [Assets.WETH]: 0,
    [Assets.WBTC]: 0,
    [Assets.USDC]: 0
  },
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
  },
  cruizeContract: null,
  selectedAssetContract: null,
  selectedAssetApproved: false,
  assetBalance: '0',
  transactionDetails: {
    loading: false,
    hash: '',
    status: 0,
    type: 'transaction'
  },
  mintTokenContract: null,
  transactionData: [],
  userInputValue: '',
  appError: '',
  lockedAsset: {
    [Assets.WETH]: 0,
    [Assets.WBTC]: 0,
    [Assets.USDC]: 0
  },
}

export default initialState

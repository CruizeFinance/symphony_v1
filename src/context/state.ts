import { Assets } from '../enums/assets'
import { NETWORK_CONFIG } from '../utils'
import State from './statemodel'

const initialState: State = {
  bgColor: 'default',
  selectedAsset: Assets.ETH,
  connectedNetwork: NETWORK_CONFIG.MAINNET.arbitrum,
  selectedTab: 'deposit',
  assetPrice: {
    [Assets.ETH]: 0,
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
  balances: {
    depositBalance: '0',
    withdraw: {
      requestBalance: {
        fundsInActiveUse: '0',
        fundsInQueue: '0',
        fundsAvailableToWithdraw: '0'
      },
      instantBalance: '0'
    }
  },
  transactionDetails: {
    loading: false,
    hash: '',
    status: 0,
    type: 'transaction',
    message: ''
  },
  mintTokenContract: null,
  transactionData: [],
  userInputValue: '',
  appError: '',
  lockedAsset: {
    [Assets.ETH]: 0,
    [Assets.WETH]: 0,
    [Assets.WBTC]: 0,
    [Assets.USDC]: 0
  },
  currentDeposit: {
    tvl: 0,
    vault_cap: 0
  },
  withdrawType: 'request',
  yieldInfoData: {
    pcg_moved: {
      0: 0
    },
    results: {
      0: 0
    }
  },
  approveTokenModal: false,
  assetAPYs: {
    eth: {
      max_apy: '??',
      base_apy: '??',
    },
    usdc: {
      max_apy: '??',
      base_apy: '??'
    },
    wbtc: {
      max_apy: '??',
      base_apy: '??'
    },
    weth: {
      max_apy: '??',
      base_apy: '??'
    }
  },
}

export default initialState

import { Contract } from 'ethers'
import { Assets } from '../enums/assets'
import { NETWORK_CONFIG } from '../utils'

export default interface State {
  bgColor:
    | 'vault'
    | Assets.USDC
    | Assets.WBTC
    | Assets.WETH
    | 'portfolio'
    | 'default'
  selectedAsset: Assets.USDC | Assets.WBTC | Assets.WETH
  connectedNetwork: typeof NETWORK_CONFIG['TESTNET']['ethereum']
  selectedTab: 'deposit' | 'withdraw'
  assetPrice: number
  priceRange: {
    upper_bound: number
    lower_bound: number
  }
  timeToExpiry: {
    principal: {
      days: number
      hours: number
      minutes: number
    }
  }
  cruizeContract: Contract | null
  selectedAssetContract: Contract | null
  mintTokenContract: Contract | null
  selectedAssetApproved: boolean
  assetBalance: string
  transactionDetails: {
    loading: boolean
    hash: string
    status: number
  }
  /* transactionData: {
    amount
  } */
}

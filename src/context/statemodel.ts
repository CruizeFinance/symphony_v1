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
  assetPrice: {
    [Assets.WETH]: number,
    [Assets.WBTC]: number,
    [Assets.USDC]: number
  }
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
  balances: {
    depositBalance:string
    withdraw: {
      instantBalance: string,
      standardBalance: {
        fundsInQueue: string,
        fundsInActiveUse: string
      }
    }
  }
  transactionDetails: {
    loading: boolean
    hash: string
    status: number
    type: 'mint' | 'approve' | 'transaction'
  }
  transactionData: {
    account: string
    asset: {
      reserve: {
        symbol: string
      }
      id: string
    }
    decimals: string
    txHash: string
    type: string
    status: string
    amount: string
  }[]
  userInputValue: string
  appError: string
  lockedAsset: {
    [Assets.WETH]: number,
    [Assets.WBTC]: number,
    [Assets.USDC]: number
  }
  currentDeposit: {
    tvl: number,
    vault_cap: number
  }
  withdrawType: 'standard' | 'instant'
}

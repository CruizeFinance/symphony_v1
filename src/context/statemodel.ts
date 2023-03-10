import { Contract } from 'ethers'
import { Assets } from '../enums/assets'
import { NetworkConfigDetail } from '../interfaces'

export default interface State {
  bgColor:
    | 'vault'
    | Assets.USDC
    | Assets.WBTC
    | Assets.WETH
    | Assets.ETH
    | 'portfolio'
    | 'default'
  selectedAsset: Assets.ETH | Assets.USDC | Assets.WBTC | Assets.WETH
  connectedNetwork: NetworkConfigDetail
  selectedTab: 'deposit' | 'withdraw'
  assetPrice: {
    [Assets.ETH]: number,
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
      requestBalance: {
        fundsInQueue: string,
        fundsInActiveUse: string,
        fundsAvailableToWithdraw: string
      }
    }
  }
  transactionDetails: {
    loading: boolean
    hash: string
    status: number
    type: 'mint' | 'approve' | 'transaction'
    message: string
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
    [Assets.ETH]: number,
    [Assets.WETH]: number,
    [Assets.WBTC]: number,
    [Assets.USDC]: number
  }
  currentDeposit: {
    tvl: number,
    vault_cap: number
  }
  withdrawType: 'request' | 'instant'
  yieldInfoData: {
    pcg_moved: {
      [x: number | string]: number,
    },
    results: {
    [x: number | string]: number
    }
  }
  approveTokenModal: boolean
  assetAPYs: {
    [Assets.ETH]: {
      max_apy: string,
      base_apy: string,
    },
    [Assets.USDC]: {
      max_apy: string,
      base_apy: string,
    },
    [Assets.WBTC]: {
      max_apy: string,
      base_apy: string,
    },
    [Assets.WETH]: {
      max_apy: string,
      base_apy: string
    }
  }
}

import { BigNumber } from 'ethers'
import { Assets } from '../enums/assets'

// transaction interface
export interface Transaction {
  hash?: string

  to?: string
  from?: string
  nonce: number

  gasLimit: BigNumber
  gasPrice?: BigNumber

  data: string
  value: BigNumber
  chainId: number

  r?: string
  s?: string
  v?: number

  // Typed-Transaction features
  type?: number | null

  // EIP-1559; Type 2
  maxPriorityFeePerGas?: BigNumber
  maxFeePerGas?: BigNumber
}

// transaction response interface
export interface TransactionResponse extends Transaction {
  hash: string

  // Only if a transaction has been mined
  blockNumber?: number
  blockHash?: string
  timestamp?: number

  confirmations: number

  // Not optional (as it is in Transaction)
  from: string

  // The raw transaction
  raw?: string

  // This function waits until the transaction has been mined
  wait: (confirmations?: number) => Promise<TransactionReceipt>
}

// transaction receipt interface
export interface TransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  root?: string
  gasUsed: BigNumber
  logsBloom: string
  blockHash: string
  transactionHash: string
  blockNumber: number
  confirmations: number
  cumulativeGasUsed: BigNumber
  effectiveGasPrice: BigNumber
  byzantium: boolean
  type: number
  status?: number
}

export interface AssetPrice {
  [asset: string]: {
    [vsCurrency: string]: number
  }
}

export interface CurrentPriceRange {
  message: {
    upper_bound: number
    lower_bound: number
  } | null
  error: null | unknown
}

export interface TVL {
  message: {
    ETH: number
    USDC: number
    WBTC: number
    WETH: number
  } | null
  error: null | unknown
}

export interface CurrentDeposit {
  message: {
    tvl: number
    vault_cap: number
  } | null
  error: null | unknown
}

export interface YieldInfoGraph {
  message: {
    pcg_moved: {
      [x: number]: number
    }
    results: {
      [x: number]: number
    }
  } | null
  error: null | unknown
}

export interface NetworkConfig {
  [key: string]: {
    [key: string]: NetworkConfigDetail
  }
}

export interface NetworkConfigDetail {
  chainId: number
  label: string
  icon: string
  networkEnv: 'mainnet' | 'testnet'
}

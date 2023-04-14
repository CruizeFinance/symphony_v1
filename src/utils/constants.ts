import { Assets } from '../enums/assets'
import { NetworkIDs, Networks } from '../enums/networks'
import { NetworkConfig } from '../interfaces'

export const VAULT_NAV_LINKS = [
  {
    link: 'twinpeaks',
    label: 'Twin Peaks',
  }
]

export const DROPDOWN_OPTIONS = [Assets.ETH, Assets.WETH, Assets.WBTC, Assets.USDC]

export const NETWORK_CONFIG: NetworkConfig = {
  MAINNET: {
    [Networks.ARBITRUM]: {
      chainId: NetworkIDs.ARBITRUM,
      label: Networks.ARBITRUM,
      icon: Networks.ARBITRUM,
      networkEnv: 'mainnet'
    }
  },
  TESTNET: {
    [Networks.ARBITRUM]: {
      chainId: NetworkIDs.ARBITRUM_GOERLI,
      label: Networks.ARBITRUM_GOERLI,
      icon: Networks.ARBITRUM,
      networkEnv: 'testnet'
    },
  },
}

export const CONTRACT_CONFIG = {
  [NetworkIDs.ARBITRUM]: {
    CRUIZE_CONTRACT: {
      address: '0xaA553dEdd3Cd9f6E2cd36A1E9B102Eb4e70322c0',
      decimals: 0,
    },
    [Assets.ETH.toUpperCase()]: {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18
    },
    [Assets.WETH.toUpperCase()]: {
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      decimals: 8,
    },
  },
  [NetworkIDs.ARBITRUM_GOERLI]: {
    CRUIZE_CONTRACT: {
      address: '0x632C4cbB61802083363662b9CC3889C7bC2C4648',
      decimals: 0,
    },
    [Assets.ETH.toUpperCase()]: {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18
    },
    [Assets.WETH.toUpperCase()]: {
      address: '0x0BA9C96583F0F1b192872A05e3c4Bc759afD36B2',
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: '0x7Ef1F6bBEe3CA066b31642fFc53D42C5435C6937',
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: '0xff737BA76F49bf82D7f13378d787685B0c6669Db',
      decimals: 8,
    },
  },
}

const MAINNET_RPC = `https://arbitrum-mainnet.infura.io/v3/${process.env
  .REACT_APP_INFURA_ID!}`
const GOERLI_RPC = `https://arbitrum-mainnet.infura.io/v3/${process.env
  .REACT_APP_INFURA_ID!}`

export const SUPPORTED_CHAINS = [
  {
    id: '0xA4B1',
    token: 'ETH',
    label: 'Arbitrum Mainnet',
    rpcUrl: MAINNET_RPC,
  },
  {
    id: '0x66EED',
    token: 'ETH',
    label: 'Arbitrum Goerli',
    rpcUrl: GOERLI_RPC,
  },
]

export const CHAIN_ID = {
  '0xA4B1': 42161,
  '0x66EED': 421613
}

export const API_PARAMS = {
  [Assets.ETH]: 'ethereum',
  [Assets.WETH]: 'ethereum',
  [Assets.WBTC]: 'bitcoin',
  [Assets.USDC]: 'usdc',
}

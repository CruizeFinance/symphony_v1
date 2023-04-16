import { arbitrum, arbitrumGoerli, /* avalancheFuji, polygonMumbai */ } from '@wagmi/chains'
/* import { goerli } from 'wagmi' */
import { Assets } from '../enums/assets'
import { NetworkIDs, Networks } from '../enums/networks'
import { NetworkConfig } from '../interfaces'

export const VAULT_NAV_LINKS = [
  {
    link: 'twinpeaks',
    label: 'Twin Peaks',
  },
  {
    link: 'yieldbooster',
    label: 'Yield Booster',
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
    /* [Networks.ETHEREUM]: {
      chainId: NetworkIDs.ETHEREUM_GOERLI,
      label: Networks.ETHEREUM_GOERLI,
      icon: Networks.ETHEREUM,
      networkEnv: 'testnet'
    }, */
    /*[Networks.POLYGON]: {
      chainId: NetworkIDs.POLYGON_MUMBAI,
      label: Networks.POLYGON_MUMBAI,
      icon: Networks.POLYGON,
    },
     [Networks.OPTIMISM]: {
      chainId: NetworkIDs.OPTIMISM_GOERLI,
      label: Networks.OPTIMISM_GOERLI,
      icon: Networks.OPTIMISM,
    }, 
    [Networks.AVALANCHE]: {
      chainId: NetworkIDs.AVALANCHE_FUJI,
      label: Networks.AVALANCHE_FUJI,
      icon: Networks.AVALANCHE
    },*/
    [Networks.ARBITRUM]: {
      chainId: NetworkIDs.ARBITRUM_GOERLI,
      label: Networks.ARBITRUM_GOERLI,
      icon: Networks.ARBITRUM,
      networkEnv: 'testnet'
    },
  },
}

export const CONTRACT_CONFIG = {
  [arbitrum.id]: {
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
  /* [goerli.id]: {
    CRUIZE_CONTRACT: {
      address: '0x8b8163a3c2C77f3DF29a2BA3150d4061aD4Ca126',
      decimals: 0,
    },
    [Assets.ETH.toUpperCase()]: {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18
    },
    [Assets.WETH.toUpperCase()]: {
      address: '0x2f87d4CF0D02248EB38CD06A3F3266C7Bc6e5bd2',
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: '0xf029E7204D23A97CCd788e808c0f45ddB6745b25',
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: '0x69CC084f5F336AC46f191721f55751cfBF2A0Ef3',
      decimals: 8,
    },
  }, */
  [arbitrumGoerli.id]: {
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

export const SUPPORTED_CHAINS = [
  arbitrum,
  /* goerli, */
  arbitrumGoerli,
  /* polygonMumbai,
  avalancheFuji, */
]

export const API_PARAMS = {
  [Assets.ETH]: 'ethereum',
  [Assets.WETH]: 'ethereum',
  [Assets.WBTC]: 'bitcoin',
  [Assets.USDC]: 'usdc',
}

export const RAMSES_VAULT_CONTRACT_CONFIG = {
  ['weth-usdc']: {
    contract: '0x81a191e51b9Ca757A5f66CCd180aF3EdE98a670D',
    assetOne: {
      contract: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      decimals: 18
    },
    assetTwo: {
      contract: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      decimals: 6
    }
  }
}

import { arbitrumGoerli, polygonMumbai } from '@wagmi/chains'
import { goerli } from 'wagmi'
import { Assets } from '../enums/assets'
import { NetworkIDs, Networks } from '../enums/networks'

export const VAULT_NAV_LINKS = [
  {
    link: 'twinpeaks',
    label: 'Protected Twin Peaks',
  },
  {
    link: 'downside',
    label: 'Downside Protection',
  },
]

export const DROPDOWN_OPTIONS = [Assets.WETH, Assets.WBTC, Assets.USDC]

export const NETWORK_CONFIG = {
  TESTNET: {
    [Networks.ETHEREUM]: {
      chainId: NetworkIDs.ETHEREUM_GOERLI,
      label: Networks.ETHEREUM_GOERLI,
      icon: Networks.ETHEREUM,
    },
    [Networks.POLYGON]: {
      chainId: NetworkIDs.POLYGON_MUMBAI,
      label: Networks.POLYGON_MUMBAI,
      icon: Networks.POLYGON,
    },
    /* [Networks.OPTIMISM]: {
      chainId: NetworkIDs.OPTIMISM_GOERLI,
      label: Networks.OPTIMISM_GOERLI,
      icon: Networks.OPTIMISM,
    }, */
    [Networks.ARBITRUM]: {
      chainId: NetworkIDs.ARBITRUM_GOERLI,
      label: Networks.ARBITRUM_GOERLI,
      icon: Networks.ARBITRUM,
    },
  },
}

export const CONTRACT_CONFIG = {
  [goerli.id]: {
    CRUIZE_CONTRACT: {
      address: '0x23800A9DB5dE3c8e0d33E858461d33181298f2D0',
      decimals: 0,
    },
    [Assets.WETH.toUpperCase()]: {
      address: '0xCCa7d1416518D095E729904aAeA087dBA749A4dC',
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: '0xf029E7204D23A97CCd788e808c0f45ddB6745b25',
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: '0x02245d57122896af490174f7421bD5a73CF7b0dc',
      decimals: 8,
    },
  },
  [polygonMumbai.id]: {
    CRUIZE_CONTRACT: {
      address: '0x08d3B3dF4512F7C437Bb149fA7b10FF7cA9A6c5E',
      decimals: 0,
    },
    [Assets.WETH.toUpperCase()]: {
      address: '0xafAa83252d90B6a209000eC389E943b03FdCB0F8',
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: '0xE7AFdD06DfD32a3175687D77Fd9a4eD270d7E814',
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: '0xedC7632768B7239BBA9F66cB807e14Cb7aF7a04E',
      decimals: 8,
    },
  },
  [arbitrumGoerli.id]: {
    CRUIZE_CONTRACT: {
      address: "0x87B027DDeA9F17a354AE7E0003607b8CAe69AD9d",
      decimals: 0,
    },
    [Assets.WETH.toUpperCase()]: {
      address: "0xB1BdbaA3A41df99701c5de37Ca6e42E87227fd54",
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: "0x58e12a048D2bF84678807F337a8E9f6f9D87d50c",
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: "0xDFB63E640d10b9Da4C9e8f8312e952f77F5c20B8",
      decimals: 8,
    }
  }
}

export const SUPPORTED_CHAINS = [goerli, arbitrumGoerli, polygonMumbai]

export const API_PARAMS = {
  [Assets.WETH]: 'ethereum',
  [Assets.WBTC]: 'bitcoin',
  [Assets.USDC]: 'usdc',
}

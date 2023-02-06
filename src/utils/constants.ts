import { arbitrumGoerli } from '@wagmi/chains'
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
    /* [Networks.POLYGON]: {
      chainId: NetworkIDs.POLYGON_MUMBAI,
      label: Networks.POLYGON_MUMBAI,
      icon: Networks.POLYGON,
    },
    [Networks.OPTIMISM]: {
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
      address: '0x63C3F2C4A88f5F98EC544b11b774034d26efD9F2',
      decimals: 0,
    },
    [Assets.WETH.toUpperCase()]: {
      address: '0xCCa7d1416518D095E729904aAeA087dBA749A4dC',
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: '0x142bBF70Ede8cEDAe4f5479846eB6Bb7D63d73b1',
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: '0xf4423F4152966eBb106261740da907662A3569C5',
      decimals: 8,
    },
  },
  [arbitrumGoerli.id]: {
    CRUIZE_CONTRACT: {
      address: "0xc904C95D0cbf50342FD92C8ab4764819F5641808",
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

export const SUPPORTED_CHAINS = [goerli, arbitrumGoerli]

export const API_PARAMS = {
  [Assets.WETH]: 'ethereum',
  [Assets.WBTC]: 'bitcoin',
  [Assets.USDC]: 'usdc',
}

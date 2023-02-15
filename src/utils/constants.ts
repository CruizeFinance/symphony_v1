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
      address: '0x23800A9DB5dE3c8e0d33E858461d33181298f2D0',
      decimals: 0,
    },
    [Assets.WETH.toUpperCase()]: {
      address: '0xB8096bC53c3cE4c11Ebb0069Da0341d75264B104',
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: '0x1D606C06d710D6b775A7CE78097ffc42e9a47B50',
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: '0x047351C5c6D860a589Cf3D4B4515a611dCD530be',
      decimals: 8,
    },
  },
  [arbitrumGoerli.id]: {
    CRUIZE_CONTRACT: {
      address: "0x7554f9068b4169C9B2fC4C4488A5509201045665",
      decimals: 0,
    },
    [Assets.WETH.toUpperCase()]: {
      address: "0xB1BdbaA3A41df99701c5de37Ca6e42E87227fd54",
      decimals: 18,
    },
    [Assets.USDC.toUpperCase()]: {
      address: "0xCE4c04988caf7585152dEd7437aF92d9740f7664",
      decimals: 6,
    },
    [Assets.WBTC.toUpperCase()]: {
      address: "0x2FFCdD8a057b121e44f9Fe7A1A9C714e987b1c53",
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

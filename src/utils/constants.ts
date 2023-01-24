import { Assets } from '../enums/assets'
import { NetworkIDs, Networks } from '../enums/networks'

export const NAV_LINKS = [
  {
    link: 'vault',
    label: 'Vault',
  },
  {
    link: 'portfolio',
    label: 'Portfolio',
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
    [Networks.OPTIMISM]: {
      chainId: NetworkIDs.OPTIMISM_GOERLI,
      label: Networks.OPTIMISM_GOERLI,
      icon: Networks.OPTIMISM,
    },
    [Networks.ARBITRUM]: {
      chainId: NetworkIDs.ARBITRUM_GOERLI,
      label: Networks.ARBITRUM_GOERLI,
      icon: Networks.ARBITRUM,
    },
  },
}

export const API_PARAMS = {
  [Assets.WETH]: 'ethereum',
  [Assets.WBTC]: 'bitcoin',
  [Assets.USDC]: 'usdc',
}

import {
  mainnet,
  arbitrum,
  arbitrumGoerli,
  goerli,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
} from '@wagmi/chains'

export enum Networks {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  OPTIMISM = 'optimism',
  ARBITRUM = 'arbitrum',
  ETHEREUM_GOERLI = 'ethereum goerli',
  POLYGON_MUMBAI = 'polygon mumbai',
  OPTIMISM_GOERLI = 'optimism goerli',
  ARBITRUM_GOERLI = 'arbitrum goerli',
}

export enum NetworkIDs {
  ETHEREUM = mainnet.id,
  POLYGON = polygon.id,
  OPTIMISM = optimism.id,
  ARBITRUM = arbitrum.id,
  ETHEREUM_GOERLI = goerli.id,
  POLYGON_MUMBAI = polygonMumbai.id,
  OPTIMISM_GOERLI = optimismGoerli.id,
  ARBITRUM_GOERLI = arbitrumGoerli.id,
}

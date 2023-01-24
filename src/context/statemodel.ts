import { Assets } from '../enums/assets'
import { NETWORK_CONFIG } from '../utils'

export default interface State {
  bgColor: 'vault' | Assets.USDC | Assets.WBTC | Assets.WETH | 'portfolio' | 'default'
  selectedAsset: Assets.USDC | Assets.WBTC | Assets.WETH
  connectedNetwork: typeof NETWORK_CONFIG['TESTNET']['ethereum']
  selectedTab: 'deposit' | 'withdraw'
  assetPrice: number
}

import { Assets } from '../enums/assets'
import { fetchWrapper } from '../utils'
import { AssetPrice } from './interfaces'

/*
 * Used to fetch the asset's current price
 */
export const getAssetPrice = async (asset: string) => {
  try {
    if (asset === Assets.USDC) return { price: 1, error: null }
    const data: AssetPrice = await fetchWrapper.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=usd`,
    )
    return {
      price: Object.keys(data).length ? data[asset]['usd'] : 0,
      error: null,
    }
  } catch (e) {
    return {
      price: 0,
      error: e,
    }
  }
}

import { Assets } from '../enums/assets'
import { fetchWrapper, formatNumberSuffix } from '../utils'
import { AssetPrice, CurrentPriceRange, TVL } from '../interfaces'

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

export const getCurrentPriceRange = async (asset: string, vault: string) => {
  try {
    const data: CurrentPriceRange = await fetchWrapper.get(
      `https://www.beta.trident.v2.cruize.finance/vaults/price_range?asset_name=${asset}&vault=${vault}`,
    )
    if (data.message?.upper_bound && data.message?.lower_bound)
      return {
        message: {
          upper_bound: data.message?.upper_bound,
          lower_bound: data.message?.lower_bound,
        },
        error: null,
      }
  } catch (e) {
    return {
      message: {
        upper_bound: 0,
        lower_bound: 0,
      },
      error: e,
    }
  }
}

export const getTVL = async (asset?: string) => {
  try {
    const data: TVL = await fetchWrapper.get(
      `https://www.beta.trident.v2.cruize.finance/vaults/${asset ? `asset_tvl?asset_symbol=${asset}` : 'total_tvl'}`
    )
    return {
      message: data.message,
      error: data.error
    }
  } catch (e) {
    return {
      message: null,
      error: e
    }
  }
}

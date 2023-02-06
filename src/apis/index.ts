import { Assets } from '../enums/assets'
import { fetchWrapper } from '../utils'
import { AssetPrice, CurrentDeposit, CurrentPriceRange, TVL, YieldInfoGraph } from '../interfaces'

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
      price: Object.keys(data).length
        ? data[asset]['usd']
        : 0,
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

export const getTVL = async () => {
  try {
    const data: TVL = await fetchWrapper.get(
      `https://www.beta.trident.v2.cruize.finance/vaults/total_tvl`,
    )
    return {
      message: {
        wbtc: data.message?.WBTC || 0,
        weth: data.message?.WETH || 0,
        usdc: data.message?.USDC || 0,
      },
      error: data.error,
    }
  } catch (e) {
    return {
      message: null,
      error: e,
    }
  }
}

export const getCurrentDeposits = async (asset: string, network: number) => {
  try {
    const data: CurrentDeposit = await fetchWrapper.get(
      `https://www.beta.trident.v2.cruize.finance/vaults/asset_tvl?asset_symbol=${asset}&network_id=${network}`
    )
    return {
      message: {
        tvl: data.message?.tvl || 0,
        vault_cap: data.message?.vault_cap || 0
      },
      error: data.error
    }
  } catch (e) {
    return {
      message: null,
      error: e,
    }
  }
}

export const loadYieldInfoGraph = async (vault: string) => {
  try {
    const data: YieldInfoGraph = await fetchWrapper.get(`https://www.beta.trident.v2.cruize.finance/vaults/strategy_plot_data?vault=${vault}`)
    if (data.error)
      return {
        message: null,
        error: data.error
      }
    return {
      message: data.message,
      error: null
    }
  } catch (e) {
    return {
      message: null,
      error: e
    }
  }
}

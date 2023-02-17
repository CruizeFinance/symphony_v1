import { Assets } from '../enums/assets'
import { fetchWrapper } from '../utils'
import {
  AssetPrice,
  CurrentDeposit,
  CurrentPriceRange,
  TVL,
  YieldInfoGraph,
} from '../interfaces'

/*
 * Used to fetch the asset's current price
 */
export const getAssetPrice = async () => {
  try {
    const data = await fetchWrapper.get(
      `https://api.coinbase.com/v2/prices/usd/spot`,
    )
    return {
      weth:
        data && data.data && data.data.length
          ? Number(
              data.data.filter(
                (a: { base: string; amount: string }) => a.base === 'ETH',
              )[0].amount,
            )
          : 0,
      wbtc:
        data && data.data && data.data.length
          ? Number(
              data.data.filter(
                (a: { base: string; amount: string }) => a.base === 'WBTC',
              )[0].amount,
            )
          : 0,
      usdc: 1,
      error: null,
    }
  } catch (e) {
    return {
      weth: 0,
      wbtc: 0,
      usdc: 0,
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
      `https://www.beta.trident.v2.cruize.finance/vaults/asset_tvl?asset_symbol=${asset}&network_id=${network}`,
    )
    return {
      message: {
        tvl: data.message?.tvl || 0,
        vault_cap: data.message?.vault_cap || 0,
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

export const loadYieldInfoGraph = async (vault: string, asset: string) => {
  try {
    const data: YieldInfoGraph = await fetchWrapper.get(
      `https://www.beta.trident.v2.cruize.finance/vaults/strategy_plot_data?vault=${vault}&asset_symbol=${asset}`,
    )
    if (data.error)
      return {
        message: null,
        error: data.error,
      }
    return {
      message: data.message,
      error: null,
    }
  } catch (e) {
    return {
      message: null,
      error: e,
    }
  }
}

export const getAssetAPYs = async () => {
  try {
    const data = await fetchWrapper.get(
      `https://www.beta.trident.v2.cruize.finance/vaults/asset_apy?vault=protected_twin_peaks`,
    )
    if (!data.error) {
      return {
        usdc: {
          max_apy: data.message.USDC.max_apy,
          base_apy: data.message.USDC.base_apy,
        },
        wbtc: {
          max_apy: data.message.WBTC.max_apy,
          base_apy: data.message.WBTC.base_apy,
        },
        weth: {
          max_apy: data.message.WETH.max_apy,
          base_apy: data.message.WETH.base_apy,
        },
      }
    }
    return {
      usdc: {
        max_apy: '??',
        base_apy: '??',
      },
      wbtc: {
        max_apy: '??',
        base_apy: '??',
      },
      weth: {
        max_apy: '??',
        base_apy: '??',
      },
    }
  } catch (e) {
    return {
      usdc: {
        max_apy: '??',
        base_apy: '??',
      },
      wbtc: {
        max_apy: '??',
        base_apy: '??',
      },
      weth: {
        max_apy: '??',
        base_apy: '??',
      },
    }
  }
}

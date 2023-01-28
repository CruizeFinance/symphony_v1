export interface AssetPrice {
  [asset: string]: {
    [vsCurrency: string]: number
  }
}

export interface CurrentPriceRange {
  message: {
    upper_bound: number
    lower_bound: number
  } | null
  error: null | unknown
}

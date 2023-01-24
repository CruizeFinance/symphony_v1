export interface AssetPrice {
  [asset: string]: {
    [vsCurrency: string]: number
  }
}

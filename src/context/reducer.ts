import { Actions } from '../enums/actions'
import { Action } from './action'
import State from './statemodel'

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.SET_BG_COLOR_VALUE:
      return {
        ...state,
        bgColor: action.payload,
      }
    case Actions.SET_SELECTED_ASSET:
      return {
        ...state,
        selectedAsset: action.payload,
      }
    case Actions.SET_CONNECTED_NETWORK:
      return {
        ...state,
        connectedNetwork: action.payload,
      }
    case Actions.SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload,
      }
    case Actions.SET_ASSET_PRICE:
      return {
        ...state,
        assetPrice: action.payload
      }
    case Actions.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: action.payload
      }
    case Actions.SET_PRINCIPAL_TIME_TO_EXPIRY:
      return {
        ...state,
        timeToExpiry: action.payload
      }
    case Actions.SET_CRUIZE_CONTRACT:
      return {
        ...state,
        cruizeContract: action.payload
      }
    case Actions.SET_SELECTED_ASSET_CONTRACT:
      return {
        ...state,
        selectedAssetContract: action.payload
      }
    case Actions.SET_SELCTED_ASSET_APPROVED:
      return {
        ...state,
        selectedAssetApproved: action.payload
      }
    case Actions.SET_ASSET_BALANCE:
      return {
        ...state,
        assetBalance: action.payload
      }
    case Actions.SET_TRANSACTION_DETAILS:
      return {
        ...state,
        transactionDetails: action.payload
      }
    case Actions.SET_MINT_TOKEN_CONTRACT:
      return {
        ...state,
        mintTokenContract: action.payload
      }
    case Actions.SET_TRANSACTION_DATA:
      return {
        ...state,
        transactionData: action.payload
      }
    case Actions.SET_USER_INPUT_VALUE:
      return {
        ...state,
        userInputValue: action.payload
      }
    case Actions.SET_APP_ERROR:
      return {
        ...state,
        appError: action.payload
      }
    case Actions.SET_TOTAL_TVL:
      return {
        ...state,
        totalTVL: action.payload
      }
    case Actions.SET_ASSET_TVL:
      return {
        ...state,
        assetTVL: action.payload
      }
    default:
      return state
  }
}

export default reducer

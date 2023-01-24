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
    default:
      return state
  }
}

export default reducer

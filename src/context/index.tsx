import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import initialState from './state'
import State from './statemodel'
import { Action } from './action'
import reducer from './reducer'
import { useNetwork } from 'wagmi'
import { Actions } from '../enums/actions'
import { API_PARAMS, NETWORK_CONFIG } from '../utils'
import { getAssetPrice } from '../apis'
import { Assets } from '../enums/assets'
import { useOnceCall } from '../hooks'

interface ContextProps {
  children: ReactNode
}

export const AppContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => {},
])

export const AppContextProvider = ({ children }: ContextProps) => {
  // context hook
  const [state, dispatch] = useReducer(reducer, initialState)

  const { chain } = useNetwork()

  const initialAPICall = async () => {
    const response = await getAssetPrice(API_PARAMS[state.selectedAsset])
    dispatch({ type: Actions.SET_ASSET_PRICE, payload: response.price })
  }

  useOnceCall(initialAPICall)

  useEffect(() => {
    if (chain)
      dispatch({
        type: Actions.SET_CONNECTED_NETWORK,
        payload: Object.values(NETWORK_CONFIG.TESTNET).filter(
          (net) => net.chainId === chain.id,
        )[0],
      })
  }, [chain])

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  )
}

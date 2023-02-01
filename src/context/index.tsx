import { createContext, ReactNode, useEffect, useReducer } from 'react'
import initialState from './state'
import State from './statemodel'
import { Action } from './action'
import reducer from './reducer'
import { erc20ABI, useAccount, useNetwork, useSigner } from 'wagmi'
import { Actions } from '../enums/actions'
import {
  API_PARAMS,
  CONTRACT_CONFIG,
  formatNumberSuffix,
  NETWORK_CONFIG,
  SUPPORTED_CHAINS,
} from '../utils'
import { getAssetPrice, getTVL } from '../apis'
import CRUIZECONTRACTABI from '../abi/cruizecontract.json'
import MINTTOKENABI from '../abi/minttoken.json'
import { useOnceCall } from '../hooks'
import { BigNumber, Contract, ethers, Signer } from 'ethers'
import { Assets } from '../enums/assets'

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
  const { data: signer } = useSigner()
  const { address } = useAccount()

  const initialAPICall = async () => {
    try {
      const totalTVL = await getTVL()
      dispatch({ type: Actions.SET_LOCKED_ASSET, payload: totalTVL.message })
      const [wbtc, weth, usdc] = await Promise.all([
        getAssetPrice(API_PARAMS['wbtc']),
        getAssetPrice(API_PARAMS['weth']),
        getAssetPrice(API_PARAMS['usdc'])
      ])
      dispatch({
        type: Actions.SET_ASSET_PRICE,
        payload: {
          wbtc: wbtc.price,
          weth: weth.price,
          usdc: usdc.price
        }
      })
    } catch (e) {
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: 'Error calling API',
      })
    }
  }

  useOnceCall(initialAPICall)

  /*
   * function to check token allowance
   */
  const checkAllowance = async (contract: Contract) => {
    try {
      const data: BigNumber = await contract.allowance(
        address!,
        CONTRACT_CONFIG[state.connectedNetwork.chainId]['CRUIZE_CONTRACT']
          .address,
      )
      dispatch({
        type: Actions.SET_SELCTED_ASSET_APPROVED,
        payload: BigNumber.from(data).gt(BigNumber.from('0')),
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (chain)
      dispatch({
        type: Actions.SET_CONNECTED_NETWORK,
        payload: Object.values(NETWORK_CONFIG.TESTNET).filter(
          (net) => net.chainId === chain.id,
        )[0],
      })
  }, [chain])

  useEffect(() => {
    if (
      signer &&
      address &&
      state.connectedNetwork &&
      SUPPORTED_CHAINS.some(
        (chain) => chain.id === state.connectedNetwork.chainId,
      )
    ) {
      const cruizeContract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId].CRUIZE_CONTRACT.address,
        CRUIZECONTRACTABI,
        signer as Signer,
      )
      dispatch({ type: Actions.SET_CRUIZE_CONTRACT, payload: cruizeContract })
      const selectedAssetContract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
        erc20ABI,
        signer as Signer,
      )
      dispatch({
        type: Actions.SET_SELECTED_ASSET_CONTRACT,
        payload: selectedAssetContract,
      })
      const mintContract: Contract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
        MINTTOKENABI,
        signer as Signer,
      )
      dispatch({ type: Actions.SET_MINT_TOKEN_CONTRACT, payload: mintContract })
      checkAllowance(selectedAssetContract)
    }
  }, [state.connectedNetwork, address, signer, state.selectedAsset])

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  )
}

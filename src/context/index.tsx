import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
} from 'react'
import initialState from './state'
import State from './statemodel'
import { Action } from './action'
import reducer from './reducer'
import { erc20ABI, useAccount, useNetwork, useSigner } from 'wagmi'
import { Actions } from '../enums/actions'
import { API_PARAMS, CONTRACT_CONFIG, NETWORK_CONFIG, SUPPORTED_CHAINS } from '../utils'
import { getAssetPrice } from '../apis'
import CRUIZECONTRACTABI from '../abi/cruizecontract.json'
import MINTTOKENABI from '../abi/minttoken.json'
import { useOnceCall } from '../hooks'
import { BigNumber, Contract, ethers, Signer } from 'ethers'
import { gql, useQuery } from '@apollo/client'

interface ContextProps {
  children: ReactNode
}

const GET_TRANSACTIONS = gql`
  {
    transactions(last: 3) {
      id
      asset
      type
      amount
      txHash
      status
      decimals
      timestamp
    }
  }
`

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

  const { data } = useQuery(GET_TRANSACTIONS)

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

  useEffect(() => {
    if (signer && address && SUPPORTED_CHAINS.some(chain => chain.id === state.connectedNetwork.chainId)) {
      const cruizeContract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId].CRUIZE_CONTRACT.address,
        CRUIZECONTRACTABI,
        signer as Signer
      )
      dispatch({ type: Actions.SET_CRUIZE_CONTRACT, payload: cruizeContract })
      const selectedAssetContract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId][state.selectedAsset.toUpperCase()].address,
        erc20ABI,
        signer as Signer
      )
      dispatch({ type: Actions.SET_SELECTED_ASSET_CONTRACT, payload: selectedAssetContract })
      const mintContract: Contract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId][state.selectedAsset.toUpperCase()].address,
        MINTTOKENABI,
        signer as Signer,
      )
      dispatch({ type: Actions.SET_MINT_TOKEN_CONTRACT, payload: mintContract })
      checkAllowance(selectedAssetContract)
    }
  }, [state.connectedNetwork, address, signer, state.selectedAsset])
  
  /*
  * function to check token allowance
  */
 const checkAllowance = async (contract: Contract) => {
   try {
     const data: BigNumber = await contract.allowance(
       address!,
       CONTRACT_CONFIG[state.connectedNetwork.chainId]['CRUIZE_CONTRACT'].address,
     )
     dispatch({
       type: Actions.SET_SELCTED_ASSET_APPROVED,
       payload: BigNumber.from(data).gt(BigNumber.from('0')),
     })
   } catch (e) {
     console.log(e)
   }
 }

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  )
}
import { createContext, ReactNode, useEffect, useReducer, useState } from 'react'
import initialState from './state'
import State from './statemodel'
import { Action } from './action'
import reducer from './reducer'
import { Actions } from '../enums/actions'
import { CHAIN_ID, CONTRACT_CONFIG, NETWORK_CONFIG, SUPPORTED_CHAINS } from '../utils'
import {
  getAssetAPYs,
  getAssetPrice,
  getCurrentDeposits,
  getTVL,
} from '../apis'
import CRUIZECONTRACTABI from '../abi/cruizecontract.json'
import MINTTOKENABI from '../abi/minttoken.json'
import ERC20ABI from '../abi/erc20abi.json'
import { useOnceCall } from '../hooks'
import { BigNumber, Contract, ethers } from 'ethers'
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { Assets } from '../enums/assets'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'

interface ContextProps {
  children: ReactNode
}

export const AppContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => {},
])

const arbitrumClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.studio.thegraph.com/query/43660/cruize-vaults/v0.0.1',
  }),
  cache: new InMemoryCache(),
})

const arbitrumGoerliClient = new ApolloClient({
  link: new HttpLink({
    uri:
      'https://api.thegraph.com/subgraphs/name/salmanbao/cruize-testing-module',
  }),
  cache: new InMemoryCache(),
})
export const AppContextProvider = ({ children }: ContextProps) => {

  const [{ wallet }] = useConnectWallet()

  // context hook
  const [state, dispatch] = useReducer(reducer, initialState)
  const [
    {
      connectedChain
    }
  ] = useSetChain()

  const initialAPICall = async () => {
    try {
      const { eth, wbtc, weth, usdc } = await getAssetPrice()
      dispatch({
        type: Actions.SET_ASSET_PRICE,
        payload: {
          eth: eth,
          wbtc: wbtc,
          weth: weth,
          usdc: usdc,
        },
      })
      const assetAPY = await getAssetAPYs()
      dispatch({ type: Actions.SET_ASSET_APYS, payload: assetAPY })
    } catch (e) {
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: 'Error calling API',
      })
    }
  }

  const setCurrentDeposit = async () => {
    try {
      const currentDeposit = await getCurrentDeposits(
        state.selectedAsset.toUpperCase(),
        CHAIN_ID[state.connectedNetwork.chainId as keyof typeof CHAIN_ID],
      )
      dispatch({
        type: Actions.SET_CURRENT_DEPOSIT,
        payload: {
          tvl: currentDeposit.message?.tvl || 0,
          vault_cap: currentDeposit.message?.vault_cap || 0,
        },
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
        wallet?.label!,
        CONTRACT_CONFIG[state.connectedNetwork.chainId as keyof typeof CHAIN_ID]['CRUIZE_CONTRACT']
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
    console.log(connectedChain)
    if (connectedChain) {
      dispatch({
        type: Actions.SET_CONNECTED_NETWORK,
        payload: Object.values(NETWORK_CONFIG)
          .flatMap((innerObj) => Object.values(innerObj))
          .filter((net) => net.chainId.toLowerCase() === connectedChain.id.toLowerCase())[0],
      })
    }
  }, [connectedChain])

  useEffect(() => {
    if (state.connectedNetwork) {
      setCurrentDeposit()
    }
  }, [state.connectedNetwork])

  useEffect(() => {
    if (
      wallet &&
      state.connectedNetwork &&
      SUPPORTED_CHAINS.some(
        (chain) => chain.id === state.connectedNetwork.chainId,
      )
    ) {
      const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
      const cruizeContract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId as keyof typeof CHAIN_ID].CRUIZE_CONTRACT.address,
        CRUIZECONTRACTABI,
        provider.getSigner(wallet.accounts[0].address)
      )
      dispatch({ type: Actions.SET_CRUIZE_CONTRACT, payload: cruizeContract })
      const selectedAssetContract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId as keyof typeof CHAIN_ID][
          state.selectedAsset.toUpperCase()
        ].address,
        ERC20ABI,
        provider.getSigner(wallet.accounts[0].address)
      )
      dispatch({
        type: Actions.SET_SELECTED_ASSET_CONTRACT,
        payload: selectedAssetContract,
      })
      const mintContract: Contract = new ethers.Contract(
        CONTRACT_CONFIG[state.connectedNetwork.chainId as keyof typeof CHAIN_ID][
          state.selectedAsset.toUpperCase()
        ].address,
        MINTTOKENABI,
        provider.getSigner(wallet.accounts[0].address)
      )
      dispatch({ type: Actions.SET_MINT_TOKEN_CONTRACT, payload: mintContract })
      if (state.selectedAsset !== Assets.ETH)
        checkAllowance(selectedAssetContract)
      else {
        dispatch({
          type: Actions.SET_SELCTED_ASSET_APPROVED,
          payload: true,
        })
      }
    }
  }, [state.connectedNetwork, wallet, state.selectedAsset])

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <ApolloProvider
        client={
          state.connectedNetwork && connectedChain &&
          state.connectedNetwork.chainId === connectedChain?.id
            ? arbitrumGoerliClient
            : arbitrumClient
        }
      >
        {children}
      </ApolloProvider>
    </AppContext.Provider>
  )
}

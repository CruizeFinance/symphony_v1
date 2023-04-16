import { gql, useQuery } from '@apollo/client'
import { ethers } from 'ethers'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTVL } from '../../apis'
import { /* Button, */ Button, Sprite, VaultCard } from '../../components'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import './vault.scss'

export const GET_TVL = gql`
  {
    tokens(first: 10, where: { type: "BASE" }) {
      symbol
      info {
        id
        amountInUSD
      }
    }
  }
`

const Vault = () => {
  const navigate = useNavigate()

  const [state, dispatch] = useContext(AppContext)

  const { data: tvlData, loading: tvlLoading } = useQuery(GET_TVL)

  const [tvl, setTVL] = useState(0)

  const [filter, setFilter] = useState('all')

  const loadTVL = async (env: 'mainnet' | 'testnet') => {
    const totalTVL = await getTVL(env)
    dispatch({ type: Actions.SET_LOCKED_ASSET, payload: totalTVL.message })
  }

  const calcTVL = useMemo(
    () =>
      tvlData && tvlData.tokens && tvlData.tokens.length
        ? tvlData.tokens
            .map((token: { info: { amountInUSD: string } }) =>
              Number(ethers.utils.formatUnits(token.info.amountInUSD, 8)),
            )
            .reduce((acc: number, currValue: number) => acc + currValue)
        : 0,
    [tvlData],
  )

  const fallbackTVL = useMemo(
    () =>
      state.lockedAsset && state.assetPrice
        ? state.lockedAsset['eth'] * state.assetPrice['eth'] +
          state.lockedAsset['usdc'] * state.assetPrice['usdc'] +
          state.lockedAsset['weth'] * state.assetPrice['weth'] +
          state.lockedAsset['wbtc'] * state.assetPrice['wbtc']
        : 0,
    [state.lockedAsset, state.assetPrice],
  )

  useEffect(() => {
    if (state.connectedNetwork && !tvlLoading && !tvlData) {
      loadTVL(state.connectedNetwork.networkEnv)
    } else {
      setTVL(calcTVL)
    }
  }, [state.connectedNetwork, tvlLoading, tvlData, calcTVL])

  useEffect(() => {
    if (fallbackTVL) setTVL(fallbackTVL)
  }, [fallbackTVL])

  useEffect(() => {
    dispatch({ type: Actions.SET_BG_COLOR_VALUE, payload: 'vault' })
  }, [])

  return (
    <>
      <div className="vault-container">
        {/* <div
          className="layer-0"
          style={{ backgroundImage: `url(/assets/background-layer-0.svg)` }}
        />
        <div className="layer-1" /> */}
        <div className="vault">
          <div className="page-title">
            <h1 className="title">Vaults</h1>
            <h3 className="sub-title">
              Invest in safer, principal protected income opportunities
              <br />
              through novel structured products
            </h3>
          </div>
          <div className="tvl-info">
            <label className="tvl-label">Total Value Locked in Cruize</label>
            <label className="tvl-value">
              {tvl ? `$${tvl.toLocaleString()}` : <>&#8212;</>}
            </label>
          </div>
          <div className="vault-filters">
            <Button
              className={filter === 'all' ? '' : 'filter-button'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              className={
                filter === 'protected-twin-peaks' ? '' : 'filter-button'
              }
              onClick={() => setFilter('protected-twin-peaks')}
            >
              Protected Twin Peaks
            </Button>
            <Button
              className={
                filter === 'ramses-yield-booster' ? '' : 'filter-button'
              }
              onClick={() => setFilter('ramses-yield-booster')}
            >
              Ramses Yield Booster
            </Button>
          </div>
          <div className="vault-options-container">
            <div className="vault-options">
              {filter !== 'ramses-yield-booster' ? (
                <>
                  <VaultCard
                    cardTitle="WBTC"
                    cardIcons={['wbtc']}
                    apy={state.assetAPYs.wbtc.max_apy}
                    onClick={() => {
                      dispatch({
                        type: Actions.SET_SELECTED_ASSET,
                        payload: 'wbtc',
                      })
                      navigate('/vaults/twinpeaks/wbtc')
                    }}
                    buttonOptions={{
                      label: 'Start Earning',
                      buttonIcon: (
                        <Sprite id="arrow-left-icon" width={16} height={16} />
                      ),
                    }}
                    cardTagLabel={'Protected Twin Peaks'}
                    vaultType={'protected-twin-peaks'}
                  />
                  <VaultCard
                    cardTitle="WETH"
                    cardIcons={['weth']}
                    apy={state.assetAPYs.weth.max_apy}
                    onClick={() => {
                      dispatch({
                        type: Actions.SET_SELECTED_ASSET,
                        payload: 'weth',
                      })
                      navigate('/vaults/twinpeaks/weth')
                    }}
                    buttonOptions={{
                      label: 'Start Earning',
                      buttonIcon: (
                        <Sprite id="arrow-left-icon" width={16} height={16} />
                      ),
                    }}
                    cardTagLabel={'Protected Twin Peaks'}
                    vaultType={'protected-twin-peaks'}
                  />
                  <VaultCard
                    cardTitle="USDC"
                    cardIcons={['usdc']}
                    apy={state.assetAPYs.usdc.max_apy}
                    onClick={() => {
                      dispatch({
                        type: Actions.SET_SELECTED_ASSET,
                        payload: 'usdc',
                      })
                      navigate('/vaults/twinpeaks/usdc')
                    }}
                    buttonOptions={{
                      label: 'Start Earning',
                      buttonIcon: (
                        <Sprite id="arrow-left-icon" width={16} height={16} />
                      ),
                    }}
                    cardTagLabel={'Protected Twin Peaks'}
                    vaultType={'protected-twin-peaks'}
                  />
                </>
              ) : null}
            </div>
            <div className="vault-options">
              {filter !== 'protected-twin-peaks' ? (
                <>
                  <VaultCard
                    cardTitle="RAM-WETH"
                    cardIcons={['rama-wethgray-image']}
                    apy={'328.77%'}
                    buttonOptions={{
                      label: 'Coming Soon',
                      disabled: true,
                    }}
                    cardTagLabel={'Ramses Yield Booster'}
                    vaultType={'ramses-yield-booster'}
                  />
                  <VaultCard
                    cardTitle="FRAX-USDC"
                    cardIcons={['frax-image', 'usdc']}
                    apy={'56.67%'}
                    buttonOptions={{
                      label: 'Coming Soon',
                      disabled: true,
                    }}
                    cardTagLabel={'Ramses Yield Booster'}
                    vaultType={'ramses-yield-booster'}
                  />
                  <VaultCard
                    cardTitle="WETH-USDC"
                    cardIcons={['wethgray-image', 'usdc']}
                    apy={'104.63%'}
                    onClick={() => {
                      dispatch({
                        type: Actions.SET_RAMSES_VAULT_PAIR,
                        payload: {
                          ...state.ramsesVaultSelection,
                          assetOne: {
                            ...state.ramsesVaultSelection.assetOne,
                            name: 'weth'
                          },
                          assetTwo: {
                            ...state.ramsesVaultSelection.assetTwo,
                            name: 'usdc'
                          }
                        },
                      })
                      navigate('/vaults/yieldbooster')
                    }}
                    buttonOptions={{
                      label: 'Start Earning',
                      buttonIcon: (
                        <Sprite id="arrow-left-icon" width={16} height={16} />
                      ),
                    }}
                    cardTagLabel={'Ramses Yield Booster'}
                    vaultType={'ramses-yield-booster'}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Vault

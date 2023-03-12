import { gql, useQuery } from '@apollo/client'
import { arbitrum } from '@wagmi/chains'
import { ethers } from 'ethers'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTVL } from '../../apis'
import { /* Button, */ Sprite, VaultCard } from '../../components'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import { DROPDOWN_OPTIONS } from '../../utils'
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

  /* const [filter, setFilter] = useState('all') */

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
        ? state.lockedAsset['usdc'] * state.assetPrice['usdc'] +
          state.lockedAsset['weth'] * state.assetPrice['weth'] +
          state.lockedAsset['wbtc'] * state.assetPrice['wbtc']
        : 0,
    [state.lockedAsset, state.assetPrice],
  )

  const maxAPY = useMemo(() => {
    let maxValue = '0'
    Object.values(state.assetAPYs).forEach((v) => {
      if (Number(v.max_apy.slice(0, v.max_apy.length - 1)) > Number(maxValue)) {
        maxValue = v.max_apy.slice(0, v.max_apy.length - 1)
      }
    })
    return maxValue
  }, [state.assetAPYs])

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
          {/* <div className="vault-filters">
            <Button
              className={filter === 'all' ? '' : 'filter-button'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              className={
                filter === 'full-principal-protected' ? '' : 'filter-button'
              }
              onClick={() => setFilter('full-principal-protected')}
            >
              Principal Protected
            </Button>
            <Button
              className={
                filter === 'camelot-yield-booster' ? '' : 'filter-button'
              }
              onClick={() => setFilter('camelot-yield-booster')}
            >
              Yield Booster
            </Button>
          </div> */}
          <div className="vault-options-container">
            <div className="vault-options">
              {/* {filter !== 'camelot-yield-booster' ? ( */}
              <>
                <VaultCard
                  cardTitle="Bullish Ascent"
                  cardInfo={
                    <>
                      Ride on the waves of the rallying markets by profiting
                      linearly as the market keeps rising in moderately bullish
                      trends
                    </>
                  }
                  cardIcons={['wbtc', 'weth', 'usdc']}
                  apy={'7.34%'}
                  buttonOptions={{
                    label: 'Coming Soon',
                    disabled: true,
                  }}
                  cardTagLabel={'Principal Protected'}
                  vaultType={'full-principal-protected'}
                />
                <VaultCard
                  cardTitle="Bearish Ascent"
                  cardInfo={
                    <>
                      Beat moderately bearish trends in the market by capturing
                      big returns in falling markets.
                    </>
                  }
                  cardIcons={['wbtc', 'weth', 'usdc']}
                  apy={'8.62%'}
                  buttonOptions={{
                    label: 'Coming Soon',
                    disabled: true,
                  }}
                  cardTagLabel={'Principal Protected'}
                  vaultType={'full-principal-protected'}
                />
                <VaultCard
                  cardTitle="Twin Peaks"
                  cardInfo={
                    <>
                      Generate returns in both rising as well as falling markets
                      by capitalising on moderately range bound markets.&nbsp;
                      <a
                        href="https://docs.cruize.finance/vaults/protected-twin-peaks"
                        rel="noreferrer noopener"
                        target={'_blank'}
                        style={{
                          fontFamily: 'GroteskMedium',
                          color: 'inherit',
                          textDecoration: 'none',
                        }}
                      >
                        Learn More
                      </a>
                    </>
                  }
                  cardIcons={DROPDOWN_OPTIONS}
                  apy={maxAPY && Number(maxAPY) ? maxAPY + '%' : '??'}
                  onClick={() => navigate('/vaults/twinpeaks')}
                  buttonOptions={{
                    label: 'Start Earning',
                    buttonIcon: (
                      <Sprite id="arrow-left-icon" width={16} height={16} />
                    ),
                  }}
                  cardTagLabel={'Principal Protected'}
                  vaultType={'full-principal-protected'}
                />
              </>
              {/* 
            ) : null} */}
            </div>
            {/* <div className="vault-options">
              {filter !== 'full-principal-protected' ? (
                <>
                  <VaultCard
                    cardTitle="ETH-USDC"
                    cardInfo={
                      <>
                        Boost your spNFT earnings by using the USDC generated on
                        your position to fund a principal protected terest
                        strategy.
                      </>
                    }
                    cardIcons={['eth', 'usdc']}
                    apy={'6.78%'}
                    buttonOptions={{
                      label: 'Coming Soon',
                      disabled: true,
                    }}
                    cardTagLabel={'Yield Booster'}
                    vaultType={'camelot-yield-booster'}
                  />
                  <VaultCard
                    cardTitle="WBTC-ETH"
                    cardInfo={
                      <>
                        Boost your spNFT earnings by using the USDC generated on
                        your position to fund a principal protected terest
                        strategy.
                      </>
                    }
                    cardIcons={['wbtc', 'eth']}
                    apy={'6.78%'}
                    buttonOptions={{
                      label: 'Coming Soon',
                      disabled: true,
                    }}
                    cardTagLabel={'Yield Booster'}
                    vaultType={'camelot-yield-booster'}
                  />
                  <VaultCard
                    cardTitle="USDT-USDC"
                    cardInfo={
                      <>
                        Boost your spNFT earnings by using the USDC generated on
                        your position to fund a principal protected terest
                        strategy.
                      </>
                    }
                    cardIcons={['usdc']}
                    apy={'6.78%'}
                    buttonOptions={{
                      label: 'Coming Soon',
                      disabled: true,
                    }}
                    cardTagLabel={'Yield Booster'}
                    vaultType={'camelot-yield-booster'}
                  />
                </>
              ) : null}
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Vault

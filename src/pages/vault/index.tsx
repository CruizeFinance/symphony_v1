import { useContext, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprite, VaultCard } from '../../components'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import { DROPDOWN_OPTIONS } from '../../utils'
import './vault.scss'

const Vault = () => {
  const navigate = useNavigate()

  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
    dispatch({ type: Actions.SET_BG_COLOR_VALUE, payload: 'vault' })
  }, [])

  const totalTVL = useMemo(
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

  return (
    <div className="vault-container">
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
            {totalTVL ? `$${totalTVL.toLocaleString()}` : <>&#8212;</>}
          </label>
        </div>
        <div className="vault-options">
          <VaultCard
            cardTitle="Bullish Ascent"
            cardInfo={
              <>
                Ride on the waves of the rallying markets by profiting linearly
                as the market keeps rising in moderately bullish trends
              </>
            }
            cardIcons={['wbtc', 'weth', 'usdc']}
            apy={'6.78%'}
            buttonOptions={{
              label: 'Coming Soon',
              disabled: true,
            }}
            cardTagLabel={'Principal Protected'}
            vaultType={'full-principal-protected'}
            active={false}
          />
          <VaultCard
            cardTitle="Bearish Ascent"
            cardInfo={
              <>
                Beat moderately bearish trends in the market by capturing big
                returns in falling markets.
              </>
            }
            cardIcons={['wbtc', 'weth', 'usdc']}
            apy={'6.78%'}
            buttonOptions={{
              label: 'Coming Soon',
              disabled: true,
            }}
            cardTagLabel={'Principal Protected'}
            vaultType={'full-principal-protected'}
            active={false}
          />
          <VaultCard
            cardTitle="Twin Peaks"
            cardInfo={
              <>
                Generate returns in both rising as well as falling markets by
                capitalising on moderately range bound markets.&nbsp;
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
            buttonOptions={{
              label: 'Start Earning',
              buttonIcon: (
                <Sprite id="arrow-left-icon" width={16} height={16} />
              ),
              onClick: () => navigate('/vaults/twinpeaks'),
            }}
            active
            cardTagLabel={'Principal Protected'}
            vaultType={'full-principal-protected'}
          />
          <VaultCard
            cardTitle="ETH-USDC"
            cardInfo={
              <>
                Boost your spNFT earnings by using the USDC generated on your
                position to fund a principal protected terest strategy.
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
            active={false}
          />
          <VaultCard
            cardTitle="WBTC-ETH"
            cardInfo={
              <>
                Boost your spNFT earnings by using the USDC generated on your
                position to fund a principal protected terest strategy.
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
            active={false}
          />
          <VaultCard
            cardTitle="USDT-USDC"
            cardInfo={
              <>
                Boost your spNFT earnings by using the USDC generated on your
                position to fund a principal protected terest strategy.
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
            active={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Vault

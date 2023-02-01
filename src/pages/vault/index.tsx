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
            cardTitle="Downside Protection"
            cardInfo={
              <>
                This vault generates interest while providing capital protection
                against market downturns. Any drawdowns below the protection
                level (price floor) result in profits.
                <br />
                <a
                  href="https://docs.cruize.finance"
                  rel="noreferrer noopener"
                  target={'_blank'}
                  style={{ color: 'inherit', textDecoration: 'undeline' }}
                >
                  Learn More &#62;
                </a>
              </>
            }
            cardIcons={DROPDOWN_OPTIONS.slice(0, 2)}
            apy={'6.78'}
            buttonOptions={{
              label: 'Coming Soon',
              disabled: true,
            }}
          />
          <VaultCard
            cardTitle="Protected Twin Peaks"
            cardInfo={
              <>
                This vault generates interest by capitalising on weekly price
                movements in either direction for both moderately bullish as
                well as bearish markets. Capital remains protected.
                <br />
                <a
                  href="https://docs.cruize.finance"
                  rel="noreferrer noopener"
                  target={'_blank'}
                  style={{ color: 'inherit', textDecoration: 'undeline' }}
                >
                  Learn More &#62;
                </a>
              </>
            }
            cardIcons={DROPDOWN_OPTIONS}
            apy={'14.72'}
            buttonOptions={{
              label: 'Start Earning',
              buttonIcon: (
                <Sprite id="arrow-left-icon" width={16} height={16} />
              ),
              onClick: () => navigate('/vaults/twinpeaks'),
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Vault

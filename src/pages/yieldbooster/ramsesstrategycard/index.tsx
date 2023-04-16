import { useContext, useEffect, useState } from 'react'
import { getCurrentPriceRange } from '../../../apis'
import { AssetDropdown, Card, Sprite } from '../../../components'
import { AppContext } from '../../../context'
import { Actions } from '../../../enums/actions'
import { formatNumberSuffix, percentge } from '../../../utils'
import './ramsesstrategycard.scss'

const RamsesStrategyCard = () => {
  const [state, dispatch] = useContext(AppContext)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  const storePriceRange = async () => {
    const response = await getCurrentPriceRange(
      (state.selectedAsset === 'usdc'
        ? 'weth'
        : state.selectedAsset
      ).toUpperCase(),
      'protected_twin_peaks',
    )
    if (!response || response.error)
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: 'Could not set price range.',
      })
    dispatch({
      type: Actions.SET_PRICE_RANGE,
      payload: {
        upper_bound: response?.message.upper_bound,
        lower_bound: response?.message.lower_bound,
      },
    })
  }

  const calculateTimeLeft = () => {
    const currentDate = new Date()
    const currentDay = currentDate.getDay()
    const nextEpochDay = new Date()
    let daysUntilNextEpoch = 1 - currentDay // daysUntilNextEpoch i.e days until nextEpochDay which is monday.
    if (daysUntilNextEpoch <= 0) {
      daysUntilNextEpoch += 7
    }
    nextEpochDay.setUTCDate(currentDate.getUTCDate() + daysUntilNextEpoch)
    nextEpochDay.setUTCHours(9, 0, 0, 0)
    const diff = nextEpochDay.getTime() - currentDate.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    dispatch({
      type: Actions.SET_PRINCIPAL_TIME_TO_EXPIRY,
      payload: {
        ...state.timeToExpiry,
        ...{
          principal: {
            days,
            hours,
            minutes,
          },
        },
      },
    })
    if (
      currentDate.getUTCDay() === 5 &&
      currentDate.getUTCHours() === 5 &&
      currentDate.getUTCMinutes() === 30
    ) {
      clearInterval(intervalId)
      setTimeoutId(
        setTimeout(() => {
          setIntervalId(setInterval(() => calculateTimeLeft(), 60000))
        }, 1000 * 60 * 60 * 24 - currentDate.getUTCMinutes() * 60 * 1000 - currentDate.getUTCSeconds() * 1000 - currentDate.getUTCMilliseconds() + 8.5 * 60 * 60 * 1000),
      )
    }
  }

  useEffect(() => {
    calculateTimeLeft()
    setIntervalId(
      setInterval(() => {
        calculateTimeLeft()
      }, 60000),
    )
    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    storePriceRange()
  }, [state.selectedAsset])

  return (
    <Card className="strategy-card">
      <div className="card-header">
        <div className="card-icons-info">
          <div className="card-icons">
            <Sprite id={`${state.ramsesVaultSelection.assetOne.name}-icon`} width={30} height={30} />
            <Sprite id={`${state.ramsesVaultSelection.assetTwo.name}-icon`} width={30} height={30} />
          </div>
          <label className="card-icons-label">
            USDC-USDT
          </label>
        </div>
        <div className="tvl">
          {state.assetPrice && state.assetPrice[state.selectedAsset] ? (
            <div className="tvl-info">
              <label className="tvl-info-value">
                {state.assetPrice && state.currentDeposit ? (
                  `$${formatNumberSuffix(
                    state.assetPrice[state.selectedAsset] *
                      state.currentDeposit.tvl || 0,
                  )}`
                ) : (
                  <>&#8212;</>
                )}
              </label>
              <label className="tvl-info-label">TVL</label>
            </div>
          ) : null}
          <div className="tvl-info">
            <label className="tvl-info-value">
              {state.assetAPYs[state.selectedAsset]?.base_apy || '??'}
            </label>
            <label className="tvl-info-label">Base APY</label>
          </div>
          <div className="tvl-info">
            <label className="tvl-info-value">
              {state.assetAPYs[state.selectedAsset]?.max_apy || '??'}
            </label>
            <label className="tvl-info-label">Max APY</label>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="section">
          <label className="card-section-title">Strategy</label>
          <p className="card-section-description">
            Boost your veRAM earnings by using the USDC generated on your
            position to fund a principal protected interest strategy.&nbsp;
            {/* <a
              href="https://docs.cruize.finance/vaults/protected-twin-peaks"
              rel="noreferrer noopener"
              target={'_blank'}
              style={{
                color: 'inherit',
                textDecoration: 'undeline',
                fontFamily: 'GroteskMedium',
              }}
            >
              Learn More &#62;
            </a> */}
          </p>
        </div>
        {state.currentDeposit ? (
          <div className="section">
            <label className="card-section-title">Current Deposits</label>
            <div className="deposit-limit">
              <div
                className="total-deposits"
                style={{
                  width: `${
                    percentge(
                      state.currentDeposit.tvl,
                      state.currentDeposit.vault_cap,
                    ) > 100
                      ? '100'
                      : state.currentDeposit.vault_cap === 0
                      ? 0
                      : percentge(
                          state.currentDeposit.tvl,
                          state.currentDeposit.vault_cap,
                        )
                  }%`,
                  transition: 'width 0.3s ease-in',
                }}
              />
              <label
                className="deposit-info"
                {...(state.approveTokenModal
                  ? { style: { zIndex: 0 } }
                  : undefined)}
              >
                {formatNumberSuffix(state.currentDeposit.tvl)}{' '}
                {state.selectedAsset.toUpperCase()} /{' '}
                {formatNumberSuffix(state.currentDeposit.vault_cap)}{' '}
                {state.selectedAsset.toUpperCase()}
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  )
}

export default RamsesStrategyCard

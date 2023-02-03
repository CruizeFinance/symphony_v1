import { useContext, useEffect, useState } from 'react'
import { getCurrentPriceRange } from '../../../apis'
import { AssetDropdown, Card } from '../../../components'
import { AppContext } from '../../../context'
import { Actions } from '../../../enums/actions'
import { formatNumberSuffix, percentge } from '../../../utils'
import './strategycard.scss'

const StrategyCard = () => {
  const [state, dispatch] = useContext(AppContext)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  const storePriceRange = async () => {
    const response = await getCurrentPriceRange(
      state.selectedAsset.toUpperCase(),
      'principal_protection',
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
    const nextFriday = new Date()
    let daysUntilFriday = 5 - currentDay
    if (daysUntilFriday <= 0) {
      daysUntilFriday += 7
    }
    nextFriday.setUTCDate(currentDate.getUTCDate() + daysUntilFriday)
    nextFriday.setUTCHours(5, 30, 0, 0)
    const diff = nextFriday.getTime() - currentDate.getTime()
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
        <AssetDropdown type="big" />
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
            <label className="tvl-info-value">2.00%</label>
            <label className="tvl-info-label">Base APY</label>
          </div>
          <div className="tvl-info">
            <label className="tvl-info-value">15.00%</label>
            <label className="tvl-info-label">Max APY</label>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="section">
          <label className="card-section-title">Strategy</label>
          <p className="card-section-description">
            This weekly strategy earns interest through an exotic option
            strategy called&nbsp;
            <span style={{ fontFamily: 'GroteskMedium' }}>Twin Peaks</span>. The
            strategy captures a linearly increasing rate of return for price
            movements in both directions up to the upper and lower barriers
            respectively.&nbsp;
            <a
              href="https://docs.cruize.finance"
              rel="noreferrer noopener"
              target={'_blank'}
              style={{
                color: 'inherit',
                textDecoration: 'undeline',
                fontFamily: 'GroteskMedium',
              }}
            >
              Learn More &#62;
            </a>
          </p>
        </div>
        <div className="section">
          <label className="card-section-title">Vault Specifications</label>
          <div className="specification">
            <div className="specification-info">
              <label className="specification-info-value">
                {state.timeToExpiry.principal.days}D{' '}
                {state.timeToExpiry.principal.hours}H{' '}
                {state.timeToExpiry.principal.minutes}M
              </label>
              <label className="specification-info-label">
                Time to next expiry
              </label>
            </div>
            <div className="specification-info">
              <label className="specification-info-value">
                ${state.priceRange.lower_bound} - $
                {state.priceRange.upper_bound}
              </label>
              <label className="specification-info-label">Current range</label>
            </div>
            <div className="specification-info">
              <label className="specification-info-value">
                {state.assetPrice
                  ? `$${state.assetPrice[state.selectedAsset]}`
                  : null}
              </label>
              <label className="specification-info-label">Current Price</label>
            </div>
          </div>
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
                      : percentge(
                          state.currentDeposit.tvl,
                          state.currentDeposit.vault_cap,
                        )
                  }%`,
                  transition: 'width 0.3s ease-in',
                }}
              />
              <label className="deposit-info">
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

export default StrategyCard

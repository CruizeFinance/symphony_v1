import { useContext, useEffect, useMemo } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { loadYieldInfoGraph } from '../../../apis'
import { Card } from '../../../components'
import { AppContext } from '../../../context'
import { Actions } from '../../../enums/actions'
import './yieldinfocard.scss'

const YieldInfoCard = () => {
  const [state, dispatch] = useContext(AppContext)

  const getYieldInfoData = async () => {
    const data = await loadYieldInfoGraph('protected_twin_peaks')
    dispatch({
      type: Actions.SET_YIELD_INFO_DATA,
      payload: {
        pcg_moved: data.message?.pcg_moved,
        results: data.message?.results,
      },
    })
  }

  useEffect(() => {
    getYieldInfoData()
  }, [])

  const graphData = useMemo(() => {
    return state.yieldInfoData.pcg_moved &&
      Object.keys(state.yieldInfoData.pcg_moved).length > 2 &&
      state.yieldInfoData.results &&
      Object.keys(state.yieldInfoData.results).length > 2
      ? Object.entries(state.yieldInfoData.pcg_moved).map(
          ([key, pcg_moved]) => ({
            pcg_moved,
            apy: state.yieldInfoData.results[key],
          }),
        )
      : []
  }, [state.yieldInfoData])

  return (
    <Card className="yield-info-card">
      <div className="card-header">
        <label className="yield-info-label">How does it work?</label>
      </div>
      <div className="card-content">
        <p className="yield-info-text">
          At the end of the vault’s 7 day period, one of the below scenarios can
          play out:
        </p>
        <div className="yield-info-section">
          <label className="yield-info-title">
            Scenario 1: Max yield up to {state.assetAPYs[state.selectedAsset].max_apy}
          </label>
          <ul>
            <li>
              <p className="yield-info-text">
                If ${state.priceRange.lower_bound} &#60;{' '}
                {state.selectedAsset.toUpperCase()} price &#60; $
                {state.priceRange.upper_bound}
              </p>
            </li>
          </ul>
        </div>
        <div className="yield-info-section">
          <label className="yield-info-title">
            Scenario 2: Base yield of {state.assetAPYs[state.selectedAsset].base_apy}
          </label>
          <ul>
            <li>
              <p className="yield-info-text">
                If {state.selectedAsset.toUpperCase()} price &#8804; $
                {state.priceRange.lower_bound} or &#62; $
                {state.priceRange.upper_bound}
              </p>
            </li>
          </ul>
        </div>
        {graphData.length ? (
          <ResponsiveContainer width={'100%'} height={250}>
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id="apys" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#396AF4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#396AF4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="pcg_moved"
                domain={[0, 'dataMax']}
                interval="preserveStartEnd"
                allowDataOverflow={false}
                tick={false}
                label={'Price Change Percentage'}
              />
              <YAxis
                dataKey="apy"
                domain={[0, 'dataMax+ 0.02']}
                interval="preserveStartEnd"
                allowDataOverflow={false}
                tick={false}
                label={'APY'}
              />
              <Tooltip
                contentStyle={{ textTransform: 'uppercase' }}
                formatter={function (value, name) {
                  return `${Number(value).toFixed(3)}%`
                }}
                labelFormatter={function (value) {
                  return `Price change: ${Number(value).toFixed(3)}%`
                }}
              />
              <Area
                dataKey={'apy'}
                type="monotone"
                stroke="#396AF4"
                fillOpacity={1}
                fill="url(#apys)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <img
            src="/assets/icons/yield-info-icon.png"
            alt="yeild-info-icon"
            width={'100%'}
            height={'auto'}
          />
        )}
      </div>
    </Card>
  )
}

export default YieldInfoCard

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
            result: state.yieldInfoData.results[key],
          }),
        )
      : []
  }, [state.yieldInfoData])

  return (
    <Card className="yield-info-card">
      <div className="card-header">
        <label className="yield-info-label">How does yield work?</label>
      </div>
      <div className="card-content">
        <p className="yield-info-text">
          At the end of the vault’s 7 day period, one of the below scenarios can
          play out:
        </p>
        <div className="yield-info-section">
          <label className="yield-info-title">
            Scenario 1: Max yield up to 15.00%
          </label>
          <ul>
            <li>
              <p className="yield-info-text">
                If $1,100.00 &#60; ETH price &#60; $1,300.00
              </p>
            </li>
          </ul>
        </div>
        <div className="yield-info-section">
          <label className="yield-info-title">
            Scenario 2: Base yield of 2%
          </label>
          <ul>
            <li>
              <p className="yield-info-text">
                If ETH price &#8804; $1,100.00 &#62; $1,300.00
              </p>
            </li>
          </ul>
        </div>
        {graphData.length ? (
          <ResponsiveContainer width={'100%'} height={250}>
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id="results" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#396AF4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#396AF4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="pcg_moved"
                domain={['dataMin', 'dataMax']}
                interval="preserveStartEnd"
                allowDataOverflow={false}
                tick={false}
                label={'Price Change Percentage'}
              />
              <YAxis
                dataKey="result"
                domain={['dataMin', 'dataMax']}
                interval="preserveStartEnd"
                allowDataOverflow={false}
                tick={false}
                label={'APY'}
              />
              <Tooltip
                contentStyle={{ textTransform: 'capitalize' }}
                formatter={function (value, name) {
                  return `${value}`
                }}
                labelFormatter={function (value) {
                  return `% moved: ${value}`
                }}
              />
              <Area
                dataKey={'result'}
                type="monotone"
                stroke="#396AF4"
                fillOpacity={1}
                fill="url(#results)"
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

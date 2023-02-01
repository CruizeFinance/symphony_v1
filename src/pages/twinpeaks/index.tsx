import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprite } from '../../components'
import FaqCard from './faqcard'
import './twinpeaks.scss'
import StakeArea from './stakearea'
import StrategyCard from './strategycard'
import YieldInfoCard from './yieldinfocard'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'

const TwinPeaks = () => {
  const [state, dispatch] = useContext(AppContext)

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch({ type: Actions.SET_BG_COLOR_VALUE, payload: state.selectedAsset })
  }, [])

  return (
    <div className="principal-container">
      <div className="principal">
        <button className="back-button" onClick={() => navigate('/')}>
          <Sprite id="chevron-left-icon" width={5} height={10} />
          Back to Home
        </button>
        <div className="container">
          <div className="info-col">
            <h1 className="title">Protected Twin Peaks</h1>
            <StrategyCard />
            <YieldInfoCard />
            <FaqCard />
          </div>
          <div className="stake-area">
            <StakeArea />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwinPeaks

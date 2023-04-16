import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprite } from '../../components'
import FaqCard from '../twinpeaks/faqcard'
import './ramsesyieldbooster.scss'
import RamsesStakeArea from './ramsesstakearea'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import RamsesStrategyCard from './ramsesstrategycard'
import RamsesYieldInfoCard from './ramsesyieldinfocard'

const YieldBooster = () => {
  const [state, dispatch] = useContext(AppContext)

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch({ type: Actions.SET_BG_COLOR_VALUE, payload: 'ramses-yield-amplifier' })
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
            <h1 className="title">Ramses Yield Amplifier</h1>
            <RamsesStrategyCard />
            <RamsesYieldInfoCard />
            <FaqCard />
          </div>
          <div className="stake-area">
            <RamsesStakeArea />
          </div>
        </div>
      </div>
    </div>
  )
}

export default YieldBooster

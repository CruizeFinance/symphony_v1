import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprite } from '../../components'
import FaqCard from './faqcard'
import './manage.scss'
import StakeArea from './stakearea'
import StrategyCard from './strategycard'
import YieldInfoCard from './yieldinfocard'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'

const Manage = () => {
  const [state, dispatch] = useContext(AppContext)

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch({ type: Actions.SET_BG_COLOR_VALUE, payload: state.selectedAsset })
  }, [])

  return (
    <div className="manage-container">
      <div className="manage">
        <button className="back-button" onClick={() => navigate('/')}>
          <Sprite id="chevron-left-icon" width={5} height={10} />
          Back to Home
        </button>
        <div className="container">
          <div className="info-col">
            <h1 className="title">Manage</h1>
            <div className='subtitle'>Stake your tokens, manage allocations and track your portfolio.</div>
            <StakeArea />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Manage

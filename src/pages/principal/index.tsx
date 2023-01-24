import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprite } from '../../components'
import FaqCard from './faqcard'
import './principal.scss'
import StakeArea from './stakearea'
import StrategyCard from './strategycard'
import YieldInfoCard from './yieldinfocard'

const Principal = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="principal">
      <button className="back-button" onClick={() => navigate('/')}>
        <Sprite id="chevron-left-icon" width={5} height={10} />
        Back to Home
      </button>
      <div className="container">
        <div className="info-col">
          <h1 className="title">Principal Protected Interest</h1>
          <StrategyCard />
          <YieldInfoCard />
          <FaqCard />
        </div>
        <StakeArea />
      </div>
    </div>
  )
}

export default Principal

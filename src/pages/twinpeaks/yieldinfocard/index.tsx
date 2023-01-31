import { Card } from '../../../components'
import './yieldinfocard.scss'

const YieldInfoCard = () => {
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
          <label className="yield-info-title">Scenario 1: Max yield up to 26.00%</label>
          <ul>
            <li>
              <p className="yield-info-text">
                If $1,100.00 &#60; ETH price &#60; $1,300.00
              </p>
            </li>
          </ul>
        </div>
        <div className="yield-info-section">
          <label className="yield-info-title">Scenario 2: Base yield of 0.5%</label>
          <ul>
            <li>
              <p className="yield-info-text">
                If ETH price &#8804; $1,100.00 &#62; $1,300.00
              </p>
            </li>
          </ul>
        </div>
        <img
          src="/assets/icons/yield-info-icon.png"
          alt="yeild-info-icon"
          width={'100%'}
          height={'auto'}
        />
      </div>
    </Card>
  )
}

export default YieldInfoCard

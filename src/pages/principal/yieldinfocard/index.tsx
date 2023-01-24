import { Card, Sprite } from '../../../components'
import './yieldinfocard.scss'

const YieldInfoCard = () => {
  return (
    <Card className="yield-info-card">
      <div className="card-header">
        <label className="label">How does yield work?</label>
      </div>
      <div className="card-content">
        <p className="info-text">
          At the end of the vault’s 7 day period, one of the below scenarios can
          play out:
        </p>
        <div className="info-section">
          <label className="info-title">Max yield of 15.00%</label>
          <ul>
            <li>
              <p className="info-text">
                If $1,100.00 &#60; ETH price &#60; $1,300.00
              </p>
            </li>
          </ul>
        </div>
        <div className="info-section">
          <label className="info-title">Base yield of 2.00%</label>
          <ul>
            <li>
              <p className="info-text">
                If ETH price &#8804; $1,100.00 &#62; $1,300.00
              </p>
            </li>
          </ul>
        </div>
        <Sprite
          id="yield-info-chart-icon"
          width={750}
          height={250}
          style={{ width: '100%' }}
        />
      </div>
    </Card>
  )
}

export default YieldInfoCard

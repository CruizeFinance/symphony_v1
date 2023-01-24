import { AssetDropdown, Card } from '../../../components'
import './strategycard.scss'

const StrategyCard = () => {
  return (
    <Card className="strategy-card">
      <div className="card-header">
        <AssetDropdown type="big" />
        <div className="tvl">
          <div className="tvl-info">
            <label className="tvl-info-value">$5.25M</label>
            <label className="tvl-info-label">TVL</label>
          </div>
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
            strategy called{' '}
            <span style={{ fontFamily: 'GroteskMedium' }}>Double No-Touch</span>
            . It allows investors to earn a high return if the price settles
            within a specified range at expiration. A guaranteed minimum coupon
            is earned even if the range is breached. The principal always
            remains protected in every condition.&nbsp;
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
              <label className="specification-info-value">4D 23H 17M</label>
              <label className="specification-info-label">
                Time to next expiry
              </label>
            </div>
            <div className="specification-info">
              <label className="specification-info-value">
                $1,100 - $1,300
              </label>
              <label className="specification-info-label">Current range</label>
            </div>
            <div className="specification-info">
              <label className="specification-info-value">$1,267.43</label>
              <label className="specification-info-label">Current Price</label>
            </div>
          </div>
        </div>
        <div className="section">
          <label className="card-section-title">Current Deposits</label>
          <div className="deposit-limit">
            <div
              className="total-deposits"
              style={{ width: '82%', transition: 'width 0.5s ease-in' }}
            />
            <label className="deposit-info">8.2k ETH / 10k ETH</label>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default StrategyCard

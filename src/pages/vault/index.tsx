import { useNavigate } from 'react-router-dom'
import { Sprite, VaultCard } from '../../components'
import './vault.scss'

const Vault = () => {
  const navigate = useNavigate()

  return (
    <div className="vault">
      <div className="page-title">
        <h1 className="title">Vaults</h1>
        <h3 className="sub-title">
          Invest in safer, principal protected income opportunities
          <br />
          through novel structured products
        </h3>
      </div>
      <div className="tvl-info">
        <label className="tvl-label">Total Value Locked in Cruize</label>
        <label className="tvl-value">$4,763,634.00</label>
      </div>
      <div className="vault-options">
        <VaultCard
          cardTitle="Downside Protection"
          cardInfo={
            <>
              This vault generates interest while providing capital protection
              against market downturns. Any drawdowns below the protection level
              (price floor) result in profits.
              <br />
              <a
                href="https://docs.cruize.finance"
                rel="noreferrer noopener"
                target={'_blank'}
                style={{ color: 'inherit', textDecoration: 'undeline' }}
              >
                Learn More &#62;
              </a>
            </>
          }
          cardIcons={['eth', 'wbtc']}
          apy={'6.78'}
          buttonOptions={{
            label: 'Coming Soon',
            disabled: true,
          }}
        />
        <VaultCard
          cardTitle="Principal Protection"
          cardInfo={
            <>
              This vault uses a weekly strategy called a range accrual, which
              generates a binary rate of interest based on whether the market
              price settles within a defined range at expiry.
              <br />
              <a
                href="https://docs.cruize.finance"
                rel="noreferrer noopener"
                target={'_blank'}
                style={{ color: 'inherit', textDecoration: 'undeline' }}
              >
                Learn More &#62;
              </a>
            </>
          }
          cardIcons={['eth', 'wbtc', 'usdc']}
          apy={'11.27'}
          buttonOptions={{
            label: 'Start Earning',
            buttonIcon: <Sprite id="arrow-left-icon" width={16} height={16} />,
            onClick: () => navigate('/portfolio'),
          }}
        />
      </div>
    </div>
  )
}

export default Vault

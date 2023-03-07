import { ReactNode } from 'react'
import { Button, Sprite } from '..'
import './vaultcard.scss'

interface VaultCardProps {
  cardTitle: string
  cardInfo: ReactNode
  cardIcons: string[]
  apy: string
  buttonOptions?: {
    label?: string
    onClick?: () => void
    buttonIcon?: ReactNode,
    disabled?: boolean
  }
  active?: boolean
  vaultType?: 'full-principal-protected' | 'camelot-yield-booster'
  cardTagLabel?: string
}

const VaultCard = ({
  cardTitle,
  cardInfo,
  cardIcons,
  apy,
  buttonOptions,
  active,
  vaultType,
  cardTagLabel
}: VaultCardProps) => {
  return (
    <div className={`vault-card ${active ? '' : 'inset'}`}>
      <div className={`card-tag ${vaultType}`}>
        <Sprite id={`${vaultType}-icon`} width={19} height={18} />
        <label className={`${vaultType}-label`}>{cardTagLabel}</label>
      </div>
      <div className="card-section">
        <div className="card-title">{cardTitle}</div>
        <div className="card-info">{cardInfo}</div>
      </div>
      <div className="card-section">
        <div className="card-icons">
          {cardIcons.map((icon, index) => (
            <Sprite key={index} id={`${icon}-icon`} width={30} height={30} />
          ))}
        </div>
        <div className="vault-apy">
          <div className="apy-label">Earn up to</div>
          <div className="apy-value">{apy}&nbsp; APY</div>
        </div>
      </div>
      {/* <div className="card-section">
      <div className="vault-details">
          <div className="vault-detail">
            <p className="vault-detail-field">Total Staked Value</p>
            <p className="vault-detail-value">
              8.67%
            </p>
          </div>
          <div className="vault-detail">
            <p className="vault-detail-field">Deposit Limit</p>
            <p className="vault-detail-value">
              8.67%
            </p>
          </div>
          <div className="vault-detail">
            <p className="vault-detail-field">Available Liquidity</p>
            <p className="vault-detail-value">
              8.67%
            </p>
          </div>
        </div>
      </div> */}
      {buttonOptions ? (
        <Button onClick={buttonOptions.onClick} disabled={buttonOptions.disabled}>
          {buttonOptions.label} {buttonOptions.buttonIcon}
        </Button>
      ) : null}
    </div>
  )
}

export default VaultCard

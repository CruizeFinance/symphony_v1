import { ReactNode } from 'react'
import { Button, Sprite } from '..'
import './vaultcard.scss'

interface VaultCardProps {
  cardTitle: string
  cardIcons: string[]
  apy: string
  onClick?: () => void
  buttonOptions?: {
    label?: string
    buttonIcon?: ReactNode
    disabled?: boolean
  }
  vaultType?: 'full-principal-protected' | 'ramses-yield-booster'
  cardTagLabel?: string
}

const VaultCard = ({
  cardTitle,
  cardIcons,
  apy,
  onClick,
  buttonOptions,
  vaultType,
  cardTagLabel,
}: VaultCardProps) => {
  return (
    <div className={`vault-card`} onClick={onClick}>
      <div className={`card-tag ${vaultType}`}>
        <Sprite id={`${vaultType}-icon`} width={19} height={18} />
        <label className={`${vaultType}-label`}>{cardTagLabel}</label>
      </div>
      <div className="card-section">
      <div className="card-icons">
          {cardIcons.map((icon, index) =>
            icon.includes('image') ? (
              <img
                src={`assets/icons/${icon}-icon.svg`}
                alt={`${icon}-icon`}
                width={82}
                height={82}
              />
            ) : (
              <Sprite key={index} id={`${icon}-icon`} width={82} height={82} />
            ),
          )}
        </div>
        <div className="card-title">{cardTitle}</div>
      </div>
      <div className="card-section">
        <div className="vault-apy">
          <div className="apy-label">Earn up to</div>
          <div className="apy-value">{apy}&nbsp; APY</div>
        </div>
      </div>
      {buttonOptions ? (
        <Button disabled={buttonOptions.disabled}>
          {buttonOptions.label} {buttonOptions.buttonIcon}
        </Button>
      ) : null}
    </div>
  )
}

export default VaultCard

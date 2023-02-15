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
}

const VaultCard = ({
  cardTitle,
  cardInfo,
  cardIcons,
  apy,
  buttonOptions,
}: VaultCardProps) => {
  return (
    <div className="vault-card">
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
      {buttonOptions ? (
        <Button onClick={buttonOptions.onClick} disabled={buttonOptions.disabled}>
          {buttonOptions.label} {buttonOptions.buttonIcon}
        </Button>
      ) : null}
    </div>
  )
}

export default VaultCard

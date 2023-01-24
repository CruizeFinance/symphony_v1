import { useContext } from 'react'
import { Button, Sprite } from '../../../components'
import { AppContext } from '../../../context'
import './confirmstake.scss'

interface ConfirmStakeProps {
  open: boolean
  hide: () => void
  amount: string
}

const ConfirmStake = ({ open, hide, amount }: ConfirmStakeProps) => {
  const [state] = useContext(AppContext)

  return (
    <div
      className="confirm-stake-container"
      style={{ width: open ? '100%' : 0 }}
    >
      <div className="stake-content">
        <div className="stake-header">
          <Sprite
            id="dropdown-expand-icon"
            width={20}
            height={20}
            onClick={hide}
            style={{ transform: 'rotate(90deg)', cursor: 'pointer' }}
          />
          <label className="stake-header-label">Summary</label>
        </div>
        <div className="transfer-area">
          <div className="graphic-area">
            <Sprite
              id={`big-${state.selectedAsset}-icon`}
              width={82}
              height={82}
            />
            <div className="arrow-animation">
              {[1, 2, 3].map((n) => (
                <div key={n} className="arrow">
                  <Sprite
                    id="right-filled-arrow"
                    width={13}
                    height={13}
                    style={{ animationDelay: `${(n - 1) * 0.7}s` }}
                  />
                </div>
              ))}
            </div>
            <Sprite id={`protect-icon`} width={92} height={92} />
          </div>
          <label className="preview-text">{state.selectedTab} preview</label>
        </div>
        <div className="transaction-details">
          <p className="details-header">Transaction details</p>
          <div className="details-list">
            <div className="detail">
              <div className="detail-field">
                <label className="detail-label">
                  {state.selectedTab === 'deposit' ? 'Deposit' : 'Withdraw'}{' '}
                  amount
                </label>
                <Sprite id="tooltip-icon" width={21} height={20} />
              </div>
              <label className="detail-value">
                {amount} {state.selectedAsset.toUpperCase()}
              </label>
            </div>
            <div className="detail">
              <div className="detail-field">
                <label className="detail-label">Time to Next Expiry</label>
                <Sprite id="tooltip-icon" width={21} height={20} />
              </div>
              <label className="detail-value">4D 23H 27M</label>
            </div>
            <div className="detail">
              <div className="detail-field">
                <label className="detail-label">Vault</label>
                <Sprite id="tooltip-icon" width={21} height={20} />
              </div>
              <label className="detail-value">Principal Protected</label>
            </div>
          </div>
        </div>
        <Button className="deposit-button">Confirm</Button>
      </div>
    </div>
  )
}

export default ConfirmStake

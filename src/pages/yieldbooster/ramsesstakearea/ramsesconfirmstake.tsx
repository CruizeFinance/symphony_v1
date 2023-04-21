import { useContext } from 'react'
import { Button, Sprite } from '../../../components'
import { AppContext } from '../../../context'
import { rem } from '../../../utils'
import './ramsesconfirmstake.scss'

interface ConfirmStakeProps {
  open: boolean
  hide: () => void
  amountOne: string
  amountTwo: string
  onConfirm: () => void
}

const ConfirmStake = ({
  open,
  hide,
  amountOne,
  amountTwo,
  onConfirm,
}: ConfirmStakeProps) => {
  const [state] = useContext(AppContext)

  return (
    <div
      className="confirm-stake-container"
      style={{
        width: open ? '100%' : 0,
        border: open ? `${rem(1)} solid var(--vault-card-border)` : '',
      }}
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
          <div
            className="graphic-area"
            {...(state.selectedTab === 'withdraw'
              ? { style: { flexDirection: 'row-reverse' } }
              : undefined)}
          >
            <div className="card-icons">
              <Sprite
                id={`${state.ramsesVaultSelection.assetOne.name}-icon`}
                width={30}
                height={30}
              />
              <Sprite
                id={`${state.ramsesVaultSelection.assetTwo.name}-icon`}
                width={30}
                height={30}
              />
            </div>
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
            {state.selectedTab === 'withdraw' ? null : (
              <>
                {state.ramsesDepositType === 'standard' ? (
                  <>
                    <div className="detail">
                      <div className="detail-field">
                        <label className="detail-label">Deposit amount</label>
                      </div>
                      <label className="detail-value">
                        {amountOne}&nbsp;
                        {state.ramsesVaultSelection.assetOne.name.toUpperCase()}
                      </label>
                    </div>
                    <div className="detail">
                      <div className="detail-field">
                        <label className="detail-label">Deposit amount</label>
                      </div>
                      <label className="detail-value">
                        {amountTwo}&nbsp;
                        {state.ramsesVaultSelection.assetTwo.name.toUpperCase()}
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="detail">
                    <div className="detail-field">
                      <label className="detail-label">Deposit amount</label>
                    </div>
                    <label className="detail-value">
                      {amountOne}&nbsp;
                      {state.ramsesVaultSelection.lp.name.toUpperCase()}
                    </label>
                  </div>
                )}
              </>
            )}
            <div className="detail">
              <div className="detail-field">
                <label className="detail-label">Vault</label>
              </div>
              <label className="detail-value">Yield Booster</label>
            </div>
          </div>
        </div>
        <Button
          className="deposit-button"
          onClick={() => onConfirm()}
          disabled={state.transactionDetails.loading}
          style={{
            background: state.transactionDetails.loading
              ? 'var(--vault-card-border)'
              : '',
          }}
        >
          {state.transactionDetails.loading ? 'Pending Transaction' : 'Confirm'}
        </Button>
      </div>
    </div>
  )
}

export default ConfirmStake

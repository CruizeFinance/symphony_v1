import { useContext } from 'react'
import { goerli } from 'wagmi'
import { Button, Loader, Sprite } from '../../../components'
import { AppContext } from '../../../context'
import { Actions } from '../../../enums/actions'
import { rem } from '../../../utils'
import './transactiondetail.scss'

interface TransactionDetailProps {
  open: boolean
  hide: () => void
}

const TransactionDetail = ({ open, hide }: TransactionDetailProps) => {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div
      className="transaction-detail-container"
      style={{
        width: open ? '100%' : 0,
        border: open ? `${rem(1)} solid var(--vault-card-border)` : '',
      }}
    >
      <div className="detail-content">
        {state.transactionDetails.loading ? (
          <Loader width={100} height={100} />
        ) : (
          <Sprite
            id={`transaction-${
              state.transactionDetails.status === 1 ? 'success' : 'failed'
            }-icon`}
            width={100}
            height={100}
          />
        )}
        <div className="detail-desc">
          <label className="detail-desc-title">
            Transaction{' '}
            {state.transactionDetails.loading
              ? 'In Progress'
              : state.transactionDetails.status === 1
              ? 'Completed Successfully'
              : 'Failed'}
          </label>
          {state.transactionDetails.message ? (
            <p className="detail-desc-text">
              {state.transactionDetails.message}
            </p>
          ) : null}
        </div>
        <Button
          className="detail-etherscan-button"
          onClick={
            state.transactionDetails.loading
              ? () =>
                  window.open(
                    `https://${
                      state.connectedNetwork.chainId === goerli.id
                        ? 'goerli.etherscan'
                        : 'testnet.arbiscan'
                    }.io/tx/${state.transactionDetails.hash}`,
                  )
              : () => {
                  hide()
                  dispatch({
                    type: Actions.SET_TRANSACTION_DETAILS,
                    payload: {
                      ...state.transactionDetails,
                      loading: false,
                      hash: '',
                      status: 0,
                      type: '',
                      message: '',
                    },
                  })
                }
          }
        >
          {state.transactionDetails.loading
            ? 'View on Etherscan'
            : state.transactionDetails.status === 1
            ? "Let's gooooooo"
            : 'Close'}
        </Button>
      </div>
    </div>
  )
}

export default TransactionDetail

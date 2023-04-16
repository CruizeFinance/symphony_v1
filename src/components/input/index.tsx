import './input.scss'
import AssetDropdown from '../assetdropdown'
import { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context'
import { useAccount } from 'wagmi'
import { Actions } from '../../enums/actions'
import { toFixed } from '../../utils'
import Sprite from '../sprite'

interface InputProps {
  prependSymbol?: string
  onInputChange: (val: string) => void
  onMaxClick?: (val: string) => void
  showAsset?: string
  hideLabel?: boolean
  inputValue: string
  assetApproved: boolean
  balance?: string
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

const Input = ({
  prependSymbol,
  onInputChange,
  onMaxClick,
  inputValue,
  showAsset,
  hideLabel,
  balance,
}: InputProps) => {
  const [state, dispatch] = useContext(AppContext)

  const { isConnected } = useAccount()

  const [input, setInputValue] = useState<string | undefined>('')

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onInputChange(
        nextUserInput[0] === '.' ? '0' + nextUserInput : nextUserInput,
      )
      setInputValue(
        nextUserInput[0] === '.' ? '0' + nextUserInput : nextUserInput,
      )
    }
  }

  const assetBalance = useMemo(
    () =>
      balance
        ? balance
        : state.selectedTab === 'deposit'
        ? toFixed(Number(state.balances.depositBalance), 4)
        : state.selectedTab === 'withdraw'
        ? state.withdrawType === 'instant'
          ? state.balances.withdraw.instantBalance
          : Number(
              state.balances.withdraw.requestBalance.fundsAvailableToWithdraw,
            )
          ? toFixed(
              Number(
                state.balances.withdraw.requestBalance.fundsAvailableToWithdraw,
              ),
              4,
            )
          : toFixed(
              Number(state.balances.withdraw.requestBalance.fundsInActiveUse),
              4,
            )
        : '0' || '0',
    [state.balances, balance],
  )

  useEffect(() => {
    setInputValue(inputValue)
  }, [inputValue])

  useEffect(() => {
    if (
      state.selectedTab === 'withdraw' &&
      state.withdrawType === 'request' &&
      Number(state.balances.withdraw.requestBalance.fundsAvailableToWithdraw) >
        0
    )
      dispatch({
        type: Actions.SET_USER_INPUT_VALUE,
        payload: toFixed(
          Number(
            state.balances.withdraw.requestBalance.fundsAvailableToWithdraw,
          ),
          4,
        ),
      })
  }, [state.selectedTab, state.withdrawType, state.balances])

  return (
    <div className="input-area">
      {hideLabel ? null : <label className="input-label">AMOUNT</label>}
      <div className="input-container">
        <div className="input-section">
          <input
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            pattern="^[0-9]*[.,]?[0-9]*$"
            maxLength={15}
            size={15}
            type={'text'}
            value={
              state.selectedTab === 'withdraw' &&
              state.withdrawType === 'request' &&
              Number(
                state.balances.withdraw.requestBalance.fundsAvailableToWithdraw,
              ) > 0
                ? state.balances.withdraw.requestBalance
                    .fundsAvailableToWithdraw
                : prependSymbol && input
                ? prependSymbol + input
                : input || ''
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (prependSymbol) {
                const value = e.target.value

                // cut off prepended symbol
                const formattedValue = value.toString().includes(prependSymbol)
                  ? value.toString().slice(1, value.toString().length + 1)
                  : value

                // replace commas with periods, because uniswap exclusively uses period as the decimal separator
                enforcer(formattedValue.replace(/,/g, '.'))
              } else {
                enforcer(e.target.value.replace(/,/g, '.'))
              }
            }}
            placeholder="0"
            className="input-field"
            /* disabled={
              (state.selectedTab === 'withdraw' &&
                state.withdrawType === 'request' &&
                Number(
                  state.balances.withdraw.requestBalance
                    .fundsAvailableToWithdraw,
                ) > 0) ||
              !assetApproved
            } */
          />
          <p className="usd-value">
            ~
            {toFixed(
              Number(input || 0) *
                (showAsset
                  ? state.assetPrice[showAsset as keyof typeof state.assetPrice]
                  : state.assetPrice[state.selectedAsset]),
              4,
            )}
          </p>
        </div>
        <div className="asset-section">
          {showAsset ? (
            <div className="asset-info">
              <Sprite id={`${showAsset}-icon`} width={32} height={32} />
              {showAsset}
            </div>
          ) : (
            <AssetDropdown optionsStyle={{ right: '0' }} />
          )}
          {isConnected ? (
            <div className="balance-button-container">
              <p className="asset-balance">
                {state.selectedTab === 'deposit' ? 'Balance' : 'Limit'}:{' '}
                {assetBalance ? Number(assetBalance.slice(0, 10)) : 0}
              </p>
              <button
                className="max-button"
                onClick={() => {
                  onMaxClick && onMaxClick(assetBalance)
                }}
              >
                MAX
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Input

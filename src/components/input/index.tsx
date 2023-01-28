import './input.scss'
import AssetDropdown from '../assetdropdown'
import { useContext, useState } from 'react'
import { AppContext } from '../../context'
import { useAccount } from 'wagmi'

interface InputProps {
  prependSymbol?: string
  onInputChange: (val: string) => void
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

const Input = ({ prependSymbol, onInputChange }: InputProps) => {
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

  return (
    <div className="input-area">
      <label className="input-label">AMOUNT</label>
      <div className="input-container">
        <div className="input-section">
          <input
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            pattern="^[0-9]*[.,]?[0-9]*$"
            maxLength={10}
            size={10}
            type={'text'}
            value={prependSymbol && input ? prependSymbol + input : input || ''}
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
          />
          <p className="usd-value">
            ~{(Number(input || 0) * state.assetPrice).toFixed(4)}
          </p>
        </div>
        <div className="asset-section">
          <AssetDropdown optionsStyle={{ right: '0' }} />
          {isConnected ? (
            <div className="balance-button-container">
              <p className="asset-balance">
                {state.selectedTab === 'deposit' ? 'Balance' : 'Limit'}: 0.887
              </p>
              <button className="max-button">MAX</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Input

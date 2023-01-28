import './stakearea.scss'
import { Button, Card, Input, Sprite, Tabs } from '../../../components'
import ConfirmStake from './confirmstake'
import { useContext, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { AppContext } from '../../../context'

const StakeCard = () => {
  const { isConnected } = useAccount()

  const [state] = useContext(AppContext)

  const [openConfirm, setOpenConfirm] = useState(false)
  const [inputValue, setInputValue] = useState('')

  return (
    <>
      <Card className="stake-card">
        <Tabs />
        <Input onInputChange={(val) => setInputValue(val)} />
        {false ? (
          <div className="error-area">
            <div className="error-title">
              <Sprite id="error-icon" width={17} height={16} />
              <label className="title-label">ERROR</label>
            </div>
            <p className="error-text">Details of the error</p>
          </div>
        ) : null}
        {!isConnected ? (
          <ConnectKitButton.Custom>
            {({ show }) => {
              return (
                <Button className="deposit-button" onClick={show}>
                  Connect Wallet
                </Button>
              )
            }}
          </ConnectKitButton.Custom>
        ) : (
          <Button
            className="deposit-button"
            onClick={() => setOpenConfirm(true)}
            disabled={Number(inputValue) <= 0}
          >
            Preview {state.selectedTab === 'deposit' ? 'Deposit' : 'Withdraw'}
          </Button>
        )}
        <label className="sub-text">
          Need help? <span className="link">Learn from video tutorials</span>
        </label>
        <ConfirmStake
          open={openConfirm}
          hide={() => setOpenConfirm(false)}
          amount={inputValue}
        />
      </Card>
      {isConnected ? <Card className="mint-tokens-card">
        <label className="mint-tokens-label">Add tokens to wallet</label>
        <Button
          className="mint-tokens-button"
          style={{
            background: `var(--${state.selectedAsset}-mint-button-background)`,
          }}
        >
          Mint {state.selectedAsset.toUpperCase()} on Testnet
          <Sprite id="mint-tokens-icon" width={20} height={21} />
        </Button>
      </Card> : null}
    </>
  )
}

export default StakeCard

import './stakearea.scss'
import { Button, Card, Input, Sprite, Tabs } from '../../../components'
import ConfirmStake from './confirmstake'
import { useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

const StakeArea = () => {
  const { isConnected } = useAccount()

  const [openConfirm, setOpenConfirm] = useState(false)
  const [inputValue, setInputValue] = useState('')

  return (
    <Card className="stake-area">
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
          Preview Deposit
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
  )
}

export default StakeArea

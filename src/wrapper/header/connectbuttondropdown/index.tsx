import { ConnectKitButton } from 'connectkit'
import { useContext, useRef, useState } from 'react'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { useAccount, useBalance, useDisconnect, useEnsName } from 'wagmi'
import { Button, Sprite } from '../../../components'
import { AppContext } from '../../../context'
import { useOutsideAlerter } from '../../../hooks'
import './connectbuttondropdown.scss'

const ConnectButtonDropdown = () => {
  const [state] = useContext(AppContext)

  const { address: accountAddress, isConnected } = useAccount()
  const { data: ensName } = useEnsName({
    address: accountAddress,
  })
  const { disconnect } = useDisconnect()
  const { data: userBalance } = useBalance({
    address: accountAddress,
    formatUnits: 'ether',
  })

  const dropdownRef = useRef(null)
  useOutsideAlerter(dropdownRef, () => setShowDropdown(false))

  const [showDropdown, setShowDropdown] = useState(false)

  console.log(state.transactionDetails)

  return (
    <div className="connect-button-dropdown" ref={dropdownRef}>
      {!isConnected ? (
        <ConnectKitButton.Custom>
          {({ show }) => {
            return (
              <Button className="connect-wallet-button" onClick={show}>
                Connect Wallet
              </Button>
            )
          }}
        </ConnectKitButton.Custom>
      ) : (
        <div className="wallet-dropdown-button">
          <button
            className="wallet-details"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Jazzicon
              diameter={24}
              seed={Math.round(Math.random() * 10000000)}
            />
            <label className="label">
              {ensName ||
                `${accountAddress?.slice(0, 4)}...${accountAddress?.slice(-4)}`}
            </label>
            <Sprite
              id="dropdown-expand-icon"
              width={24}
              height={24}
              {...(showDropdown
                ? { style: { transform: 'rotate(180deg)' } }
                : undefined)}
            />
          </button>
        </div>
      )}
      {showDropdown ? (
        <div className="wallet-dropdown">
          <div className="wallet-info">
            <Jazzicon
              diameter={74}
              seed={Math.round(Math.random() * 10000000)}
            />
            <div className="wallet-name-balance">
              <label className="wallet-name">
                {ensName ||
                  `${accountAddress?.slice(0, 4)}...${accountAddress?.slice(
                    -4,
                  )}`}
              </label>
              <label className="wallet-balance">
                {userBalance?.formatted.slice(0, 8)}
              </label>
            </div>
            <div className="wallet-actions">
              <div
                className="action"
                onClick={() => {
                  window.navigator.clipboard.writeText(accountAddress || '')
                  setShowDropdown(false)
                }}
              >
                <Sprite id="copy-address-icon" width={19} height={18} />
                <label className="action-label">Copy</label>
              </div>
              <div
                className="action"
                onClick={() => {
                  disconnect()
                  setShowDropdown(false)
                }}
              >
                <Sprite id="disconnect-wallet-icon" width={19} height={18} />
                <label className="action-label">Disconnect</label>
              </div>
            </div>
          </div>
          <div className="transactions">
            <label className="title">Recent Transactions</label>
            {false ? (
              <>
                {/* <div className="list">
                <div className="transaction">
                  <div className="details">
                    <div className="icon">
                      <div className="loader" />
                    </div>
                    <div className="details-label">
                      <label className="transaction-info">
                        Deposit 1 ETH to PP Vault
                      </label>
                      <label className="transaction-status">Pending</label>
                    </div>
                    <div className="icon">
                      <Sprite id="redirect-link-icon" width={24} height={24} />
                    </div>
                  </div>
                </div>
                <div className="transaction">
                  <div className="details">
                    <div className="icon">
                      <Sprite
                        id="transaction-failed-icon"
                        width={28}
                        height={28}
                      />
                    </div>
                    <div className="details-label">
                      <label className="transaction-info">
                        Deposit 1 ETH to PP Vault
                      </label>
                      <label
                        className="transaction-status"
                        style={{
                          color: 'var(--transaction-failed-label-color)',
                        }}
                      >
                        Failed
                      </label>
                    </div>
                    <div className="icon">
                      <Sprite id="redirect-link-icon" width={24} height={24} />
                    </div>
                  </div>
                </div>
                <div className="transaction">
                  <div className="details">
                    <div className="icon">
                      <Sprite
                        id="transaction-success-icon"
                        width={28}
                        height={28}
                      />
                    </div>
                    <div className="details-label">
                      <label className="transaction-info">
                        Deposit 3 ETH to DP Vault
                      </label>
                      <label className="transaction-status">Confirmed</label>
                    </div>
                    <div className="icon">
                      <Sprite id="redirect-link-icon" width={24} height={24} />
                    </div>
                  </div>
                </div>
                <div className="transaction">
                  <div className="details">
                    <div className="details-label" style={{ width: '90%' }}>
                      <label className="transaction-info">
                        View more on Etherscan
                      </label>
                    </div>
                    <div className="icon">
                      <Sprite id="redirect-link-icon" width={24} height={24} />
                    </div>
                  </div>
                </div>
              </div> */}
              </>
            ) : (
              <div className="no-transactions">
                <Sprite id="transaction-coins-icon" width={50} height={50} />
                <label className="no-transactions-label">
                  You haven't made any transactions yet
                </label>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ConnectButtonDropdown

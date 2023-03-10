import { ConnectKitButton } from 'connectkit'
import { useContext, useEffect, useRef, useState } from 'react'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import {
  goerli,
  useAccount,
  useDisconnect,
  useEnsName,
  useProvider,
} from 'wagmi'
import { Button, Loader, Sprite } from '../../../components'
import { AppContext } from '../../../context'
import { useOutsideAlerter } from '../../../hooks'
import './connectbuttondropdown.scss'
import { gql, useQuery } from '@apollo/client'
import { Actions } from '../../../enums/actions'
import { ethers } from 'ethers'
import { CONTRACT_CONFIG } from '../../../utils'
import { arbitrum } from '@wagmi/chains'

const GET_TRANSACTIONS = gql`
  query Transactions($account: String!) {
    transactions(
      orderBy: timestamp
      orderDirection: desc
      where: { account: $account }
    ) {
      amount
      status
      type
      asset {
        id
        reserve {
          name
          symbol
          decimals
        }
      }
      account
      timestamp
      txHash
      decimals
      id
    }
  }
`

const ConnectButtonDropdown = () => {
  const [state, dispatch] = useContext(AppContext)

  const { address: accountAddress, isConnected } = useAccount()
  const { data: ensName } = useEnsName({
    address: accountAddress,
  })
  const { disconnect } = useDisconnect()

  const provider = useProvider()

  const dropdownRef = useRef(null)
  useOutsideAlerter(dropdownRef, () => setShowDropdown(false))

  const { data: transactionData, loading } = useQuery(GET_TRANSACTIONS, {
    variables: {
      account: accountAddress,
    },
  })

  const [showDropdown, setShowDropdown] = useState(false)
  const [bal, setBal] = useState('')

  const loadBalance = async () => {
    const bal = await provider.getBalance(accountAddress || '')
    setBal(ethers.utils.formatUnits(bal, 18))
  }

  useEffect(() => {
    if (transactionData) {
      dispatch({
        type: Actions.SET_TRANSACTION_DATA,
        payload: [...transactionData.transactions],
      })
    }
  }, [transactionData])

  useEffect(() => {
    loadBalance()
  }, [])

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
            <Jazzicon diameter={24} seed={40} />
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
            <Jazzicon diameter={74} seed={40} />
            <div className="wallet-name-balance">
              <label className="wallet-name">
                {ensName ||
                  `${accountAddress?.slice(0, 4)}...${accountAddress?.slice(
                    -4,
                  )}`}
              </label>
              <label className="wallet-balance">
                {bal}
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
            {state.transactionDetails.loading &&
            state.transactionDetails.type === 'transaction' ? (
              <div className="list">
                <div className="transaction">
                  <div
                    className="details"
                    onClick={() =>
                      window.open(
                        `https://${
                          state.connectedNetwork.chainId === arbitrum.id
                            ? 'arbiscan'
                            : state.connectedNetwork.chainId === goerli.id
                            ? 'goerli.etherscan'
                            : 'testnet.arbiscan'
                        }.io/tx/${state.transactionDetails.hash}`,
                        '_blank',
                        'noreferrer noopener',
                      )
                    }
                  >
                    <div className="icon">
                      <Loader />
                    </div>
                    <div className="details-label">
                      <label className="transaction-info">
                        {state.selectedTab.toUpperCase()} {state.userInputValue}{' '}
                        {state.selectedAsset.toUpperCase()}{' '}
                        {state.selectedTab === 'deposit' ? 'to' : 'from'} TP
                        Vault
                      </label>
                      <label className="transaction-status">Pending</label>
                    </div>
                    <div className="icon">
                      <Sprite id="redirect-link-icon" width={24} height={24} />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {state.transactionData.length ? (
              <div className="list">
                {state.transactionData.slice(0, 3).map((transaction) => (
                  <div className="transaction" key={transaction.txHash}>
                    <div
                      className="details"
                      onClick={() => {
                        window.open(
                          `https://${
                            state.connectedNetwork.chainId === arbitrum.id
                              ? 'arbiscan'
                              : state.connectedNetwork.chainId === goerli.id
                              ? 'goerli.etherscan'
                              : 'testnet.arbiscan'
                          }/tx/${transaction.txHash}`,
                          '_blank',
                          'noreferrer noopener',
                        )
                      }}
                    >
                      <Sprite
                        id={`transaction-${transaction.status.toLowerCase()}-icon`}
                        width={28}
                        height={28}
                      />
                      <div className="details-label">
                        <label className="transaction-info">
                          <>
                            {transaction.type.toUpperCase()}{' '}
                            {ethers.utils.formatUnits(
                              transaction.amount,
                              transaction.decimals,
                            )}{' '}
                            {transaction.asset.reserve.symbol}{' '}
                            {transaction.type.toLowerCase() === 'deposit'
                              ? 'to'
                              : 'from'}{' '}
                            TP Vault
                          </>
                        </label>
                        <label className="transaction-status">
                          {transaction.status.toLowerCase()}
                        </label>
                      </div>
                      <div className="icon">
                        <Sprite
                          id="redirect-link-icon"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {state.transactionData.length > 3 ? (
                  <div className="transaction">
                    <div
                      className="details"
                      onClick={() =>
                        window.open(
                          `https://${
                            state.connectedNetwork.chainId === arbitrum.id
                              ? 'arbiscan'
                              : state.connectedNetwork.chainId === goerli.id
                              ? 'goerli.etherscan'
                              : 'testnet.arbiscan'
                          }.io/address/${
                            CONTRACT_CONFIG[state.connectedNetwork.chainId][
                              'CRUIZE_CONTRACT'
                            ]['address']
                          }`,
                          '_blank',
                          'noreferrer noopener',
                        )
                      }
                    >
                      <div className="details-label" style={{ width: '90%' }}>
                        <label className="transaction-info">
                          View more on{' '}
                          {state.connectedNetwork.chainId === goerli.id
                            ? 'Etherscan'
                            : 'Arbiscan'}
                        </label>
                      </div>
                      <div className="icon">
                        <Sprite
                          id="redirect-link-icon"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : state.transactionDetails.loading ? null : (
              <div className="no-transactions">
                <Sprite id="transaction-coins-icon" width={50} height={50} />
                <label className="no-transactions-label">
                  {loading
                    ? 'Loading your transactions'
                    : "You haven't made any transactions yet"}
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

import './stakearea.scss'
import {
  Button,
  Card,
  Input,
  Modal,
  Sprite,
  Tabs,
  Tooltip,
} from '../../../components'
import ConfirmStake from './confirmstake'
import { useContext, useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount, useProvider } from 'wagmi'
import { AppContext } from '../../../context'
import { BigNumber, ethers } from 'ethers'
import { Actions } from '../../../enums/actions'
import { CONTRACT_CONFIG, rem, toFixed } from '../../../utils'
import { TransactionReceipt, TransactionResponse } from '../../../interfaces'
import TransactionDetail from './transactiondetail'
import ConfettiExplosion from 'react-confetti-explosion'
import { Assets } from '../../../enums/assets'

interface WithdrawDetail {
  label: string
  icon?: string
  amount: string | number
  unit: string
  tooltip?: string
}

const WithdrawDetail = ({
  label,
  icon,
  amount,
  unit,
  tooltip,
}: WithdrawDetail) => {
  return (
    <div className="withdraw-detail">
      <div className="withdraw-detail-field">
        <label className="withdraw-detail-label">{label}</label>
        {tooltip ? (
          <Tooltip text={tooltip}>
            <Sprite id={icon ?? ''} width={16} height={16} />
          </Tooltip>
        ) : null}
      </div>
      <label className="withdraw-detail-value">
        {amount} {unit}
      </label>
    </div>
  )
}

const StakeCard = () => {
  const [state, dispatch] = useContext(AppContext)

  const { address, isConnected, connector } = useAccount()
  const provider = useProvider()

  const [openConfirm, setOpenConfirm] = useState(false)
  const [disableRequest, setDisableRequest] = useState(false)
  const [openTransactionDetail, setOpenTransactionDetail] = useState(false)
  const [roundPrice, setRoundPrice] = useState(BigNumber.from(0))

  const getBalance = async () => {
    try {
      let depositBalance = BigNumber.from(0)
      if (state.selectedAsset === Assets.ETH) {
        depositBalance = await provider.getBalance(address || '')
      } else {
        depositBalance = await state.selectedAssetContract!.balanceOf(address)
      }
      const depositReceipts = await state.cruizeContract!.depositReceipts(
        address,
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
      )
      const vault = await state.cruizeContract!.vaults(
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
      )
      const withdrawals = await state.cruizeContract!.withdrawals(
        address,
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
      )
      const lockedAmount = await state.cruizeContract!.balanceOfUser(
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
        address,
      )
      const roundPricePerShare = await state.cruizeContract!.pricePerShare(
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
      )
      const withdrawalPricePerShare = await state.cruizeContract!.roundPricePerShare(
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
        withdrawals.round < vault.round ? withdrawals.round : vault.round,
      )
      setRoundPrice(roundPricePerShare)
      dispatch({
        type: Actions.SET_BALANCES,
        payload: {
          depositBalance: ethers.utils.formatUnits(
            depositBalance as BigNumber,
            CONTRACT_CONFIG[state.connectedNetwork.chainId][
              state.selectedAsset.toUpperCase()
            ].decimals,
          ),
          withdraw: {
            instantBalance:
              vault.round === depositReceipts.round
                ? ethers.utils.formatUnits(
                    depositReceipts.amount,
                    CONTRACT_CONFIG[state.connectedNetwork.chainId][
                      state.selectedAsset.toUpperCase()
                    ].decimals,
                  )
                : '0',
            requestBalance: {
              fundsInActiveUse: ethers.utils.formatUnits(
                lockedAmount,
                CONTRACT_CONFIG[state.connectedNetwork.chainId][
                  state.selectedAsset.toUpperCase()
                ].decimals,
              ),
              fundsInQueue:
                vault.round === withdrawals.round
                  ? (
                      Number(
                        ethers.utils.formatUnits(
                          withdrawals.shares,
                          CONTRACT_CONFIG[state.connectedNetwork.chainId][
                            state.selectedAsset.toUpperCase()
                          ].decimals,
                        ),
                      ) *
                      Number(
                        ethers.utils.formatUnits(
                          roundPricePerShare,
                          CONTRACT_CONFIG[state.connectedNetwork.chainId][
                            state.selectedAsset.toUpperCase()
                          ].decimals,
                        ),
                      )
                    ).toString()
                  : '0',
              fundsAvailableToWithdraw:
                vault.round > withdrawals.round
                  ? (
                      Number(
                        ethers.utils.formatUnits(
                          withdrawals.shares,
                          CONTRACT_CONFIG[state.connectedNetwork.chainId][
                            state.selectedAsset.toUpperCase()
                          ].decimals,
                        ),
                      ) *
                      Number(
                        ethers.utils.formatUnits(
                          withdrawalPricePerShare,
                          CONTRACT_CONFIG[state.connectedNetwork.chainId][
                            state.selectedAsset.toUpperCase()
                          ].decimals,
                        ),
                      )
                    ).toString()
                  : '0',
            },
          },
        },
      })
      setDisableRequest(
        Number(
          ethers.utils.formatUnits(
            lockedAmount,
            CONTRACT_CONFIG[state.connectedNetwork.chainId][
              state.selectedAsset.toUpperCase()
            ].decimals,
          ),
        ) <= 0 &&
          Number(
            ethers.utils.formatUnits(
              withdrawals.shares,
              CONTRACT_CONFIG[state.connectedNetwork.chainId][
                state.selectedAsset.toUpperCase()
              ].decimals,
            ),
          ) <= 0,
      )
    } catch (e) {
      resetTransactionDetails()
    }
  }

  /*
   * a function to approve erc20 token to spend
   */
  const approveToken = async () => {
    try {
      dispatch({
        type: Actions.SET_TRANSACTION_DETAILS,
        payload: {
          loading: false,
          hash: '',
          status: 0,
          type: 'approve',
          message: `Approving ${state.selectedAsset.toUpperCase()} for contract interaction`,
        },
      })
      const tx = await state.selectedAssetContract!.approve(
        CONTRACT_CONFIG[state.connectedNetwork.chainId]['CRUIZE_CONTRACT']
          .address,
        ethers.constants.MaxUint256,
      )
      dispatch({ type: Actions.SET_APPROVE_TOKEN_MODAL, payload: false })
      const data = await transactionExecution(tx, 'approve')
      dispatch({
        type: Actions.SET_SELCTED_ASSET_APPROVED,
        payload: (data as TransactionReceipt).status === 1,
      })
    } catch (e) {
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: 'The transaction was cancelled and could not be completed',
      })
      resetTransactionDetails()
    }
  }

  const transactionExecution = async (
    tx: TransactionResponse,
    type: string,
  ) => {
    try {
      setOpenConfirm(false)
      setOpenTransactionDetail(true)
      dispatch({
        type: Actions.SET_TRANSACTION_DETAILS,
        payload: {
          ...state.transactionDetails,
          loading: true,
          hash: tx.hash,
          type,
        },
      })
      const data: TransactionReceipt = await tx.wait()
      dispatch({
        type: Actions.SET_TRANSACTION_DETAILS,
        payload: {
          ...state.transactionDetails,
          loading: false,
          hash: data.transactionHash,
          status: data.status || 0,
          type: type,
        },
      })
      if (type === 'transaction')
        dispatch({
          type: Actions.SET_TRANSACTION_DATA,
          payload: [
            {
              account: address,
              asset: {
                reserve: {
                  symbol: state.selectedAsset.toUpperCase(),
                },
                id:
                  CONTRACT_CONFIG[state.connectedNetwork.chainId][
                    state.selectedAsset.toUpperCase()
                  ].address,
              },
              decimals:
                CONTRACT_CONFIG[state.connectedNetwork.chainId][
                  state.selectedAsset.toUpperCase()
                ].decimals,
              txHash: tx.hash,
              type: state.selectedTab.toUpperCase(),
              status: data.status === 1 ? 'SUCCESS' : 'FAILED',
              amount: ethers.utils
                .parseUnits(
                  state.userInputValue,
                  CONTRACT_CONFIG[state.connectedNetwork.chainId][
                    state.selectedAsset.toUpperCase()
                  ].decimals,
                )
                .toString(),
            },
            ...state.transactionData,
          ],
        })
      return data
    } catch (e) {
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: (e as { message: string }).message,
      })
    }
  }

  const resetTransactionDetails = () => {
    dispatch({
      type: Actions.SET_TRANSACTION_DETAILS,
      payload: {
        loading: false,
        hash: '',
        status: 0,
        type: '',
        message: '',
      },
    })
    dispatch({
      type: Actions.SET_USER_INPUT_VALUE,
      payload: '',
    })
    dispatch({ type: Actions.SET_APPROVE_TOKEN_MODAL, payload: false })
    setOpenConfirm(false)
  }

  const onConfirm = async () => {
    try {
      dispatch({
        type: Actions.SET_TRANSACTION_DETAILS,
        payload: {
          loading: false,
          hash: '',
          status: 0,
          type: 'transaction',
        },
      })
      writeContract(
        state.selectedTab === 'withdraw'
          ? state.withdrawType === 'instant'
            ? Number(state.balances.withdraw.instantBalance) > 0
              ? 'instantWithdrawal'
              : ''
            : Number(
                state.balances.withdraw.requestBalance.fundsAvailableToWithdraw,
              ) > 0
            ? 'standardWithdrawal'
            : Number(state.balances.withdraw.requestBalance.fundsInActiveUse) >
              0
            ? 'initiateWithdrawal'
            : ''
          : 'deposit',
        state.selectedTab === 'withdraw'
          ? state.withdrawType === 'instant'
            ? Number(state.balances.withdraw.instantBalance) > 0
              ? [
                  CONTRACT_CONFIG[state.connectedNetwork.chainId][
                    state.selectedAsset.toUpperCase()
                  ].address,
                  ethers.utils.parseUnits(
                    state.userInputValue || '0',
                    CONTRACT_CONFIG[state.connectedNetwork.chainId][
                      state.selectedAsset.toUpperCase()
                    ].decimals,
                  ),
                ]
              : []
            : Number(
                state.balances.withdraw.requestBalance.fundsAvailableToWithdraw,
              ) > 0
            ? [
                CONTRACT_CONFIG[state.connectedNetwork.chainId][
                  state.selectedAsset.toUpperCase()
                ].address,
              ]
            : Number(state.balances.withdraw.requestBalance.fundsInActiveUse) >
              0
            ? [
                CONTRACT_CONFIG[state.connectedNetwork.chainId][
                  state.selectedAsset.toUpperCase()
                ].address,
                ethers.utils.parseUnits(
                  ethers.utils.formatUnits(
                    ethers.utils
                      .parseUnits(
                        state.userInputValue || '0',
                        CONTRACT_CONFIG[state.connectedNetwork.chainId][
                          state.selectedAsset.toUpperCase()
                        ].decimals,
                      )
                      .mul(
                        BigNumber.from('10').pow(
                          BigNumber.from(
                            CONTRACT_CONFIG[state.connectedNetwork.chainId][
                              state.selectedAsset.toUpperCase()
                            ].decimals,
                          ),
                        ),
                      )
                      .div(roundPrice),
                    CONTRACT_CONFIG[state.connectedNetwork.chainId][
                      state.selectedAsset.toUpperCase()
                    ].decimals,
                  ),
                  CONTRACT_CONFIG[state.connectedNetwork.chainId][
                    state.selectedAsset.toUpperCase()
                  ].decimals,
                ),
              ]
            : []
          : state.selectedAsset === Assets.ETH
          ? [
              CONTRACT_CONFIG[state.connectedNetwork.chainId][
                state.selectedAsset.toUpperCase()
              ].address,
              ethers.utils.parseUnits(
                state.userInputValue || '0',
                CONTRACT_CONFIG[state.connectedNetwork.chainId][
                  state.selectedAsset.toUpperCase()
                ].decimals,
              ),
              {
                value: ethers.utils.parseEther(state.userInputValue || '0'),
              },
            ]
          : [
              CONTRACT_CONFIG[state.connectedNetwork.chainId][
                state.selectedAsset.toUpperCase()
              ].address,
              ethers.utils.parseUnits(
                state.userInputValue || '0',
                CONTRACT_CONFIG[state.connectedNetwork.chainId][
                  state.selectedAsset.toUpperCase()
                ].decimals,
              ),
            ],
      )
    } catch (e) {
      console.log(e)
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: (e as { message: string }).message,
      })
      resetTransactionDetails()
    }
  }

  const writeContract = async (
    functionName: string,
    args: Array<BigNumber | string | undefined | { value: BigNumber }>,
  ) => {
    try {
      dispatch({
        type: Actions.SET_TRANSACTION_DETAILS,
        payload: {
          ...state.transactionDetails,
          message: `${state.selectedTab.toUpperCase()} ${
            state.userInputValue
          } ${state.selectedAsset.toUpperCase()}`,
        },
      })
      const tx = await state.cruizeContract![functionName](...args)
      await transactionExecution(tx, 'transaction')
    } catch (e) {
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: 'The transaction was cancelled and could not be completed',
      })
      resetTransactionDetails()
    }
  }

  const mintToken = async () => {
    try {
      dispatch({
        type: Actions.SET_TRANSACTION_DETAILS,
        payload: {
          loading: false,
          hash: '',
          status: 0,
          type: 'mint',
          message: `Minting ${
            state.selectedAsset === 'usdc' ? 100 : 1
          } ${state.selectedAsset.toUpperCase()}`,
        },
      })
      const tx = await state.mintTokenContract!['mint'](
        ethers.utils.parseUnits(
          state.selectedAsset === 'usdc' ? '100' : '1',
          CONTRACT_CONFIG[state.connectedNetwork.chainId][
            state.selectedAsset.toUpperCase()
          ].decimals || '',
        ),
      )
      await transactionExecution(tx, 'mint')
    } catch (e) {
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: 'The transaction was cancelled and could not be completed',
      })
      resetTransactionDetails()
    }
  }

  const addToken = async () => {
    try {
      await (window.ethereum as any).request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address:
              CONTRACT_CONFIG[state.connectedNetwork.chainId][
                state.selectedAsset.toUpperCase()
              ].address, // The address that the token is at.
            symbol: state.selectedAsset.toUpperCase(), // A ticker symbol or shorthand, up to 5 chars.
            decimals:
              CONTRACT_CONFIG[state.connectedNetwork.chainId][
                state.selectedAsset.toUpperCase()
              ].decimals, // The number of decimals in the token
          },
        },
      })
    } catch (e) {
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: (e as { message: string }).message,
      })
    }
  }

  useEffect(() => {
    if (address && state.selectedAssetContract) {
      getBalance()
    }
  }, [
    state.selectedTab,
    state.selectedAsset,
    state.selectedAssetContract,
    address,
    state.transactionDetails,
    state.withdrawType,
    state.connectedNetwork,
  ])

  useEffect(() => {
    if (state.appError) {
      const timeout = setTimeout(() => {
        dispatch({ type: Actions.SET_APP_ERROR, payload: '' })
        clearTimeout(timeout)
      }, 7000)
    }
  }, [state.appError])

  useEffect(() => {
    if (disableRequest)
      dispatch({ type: Actions.SET_WITHDRAW_TYPE, payload: 'instant' })
  }, [disableRequest])

  return (
    <>
      {state.transactionDetails.status === 1 ? (
        <ConfettiExplosion
          width={window.innerWidth}
          height={window.innerHeight}
          duration={3000}
        />
      ) : null}
      <Card className="stake-card">
        <Tabs
          tabs={[
            {
              label: 'deposit',
            },
            {
              label: 'withdraw',
            },
          ]}
          onChange={(val) => {
            dispatch({
              type: Actions.SET_USER_INPUT_VALUE,
              payload: '',
            })
            dispatch({
              type: Actions.SET_SELECTED_TAB,
              payload: val,
            })
          }}
          defaultTab={state.selectedTab}
        />
        {state.selectedTab === 'withdraw' ? (
          <Tabs
            tabs={[
              {
                label: 'request',
                tooltip:
                  'Your deposit is making $$ for you. Submit a request and we’ll keep your deposit aside before the next round begins. You can come back to this tab after the current round ends to finish your withdrawal.',
              },
              {
                label: 'instant',
                tooltip:
                  'Withdraw right away as your deposit is not being used in the vault strategy currently.',
              },
            ]}
            onChange={(val) => {
              dispatch({
                type: Actions.SET_USER_INPUT_VALUE,
                payload: '',
              })
              dispatch({
                type: Actions.SET_WITHDRAW_TYPE,
                payload: val,
              })
            }}
            type="contained"
            disabledTab={[
              ...[disableRequest ? 'request' : ''],
              ...[
                Number(state.balances.withdraw.instantBalance) <= 0
                  ? 'instant'
                  : '',
              ],
            ]}
            defaultTab={state.withdrawType}
          />
        ) : null}
        <Input
          onInputChange={(val) =>
            dispatch({
              type: Actions.SET_USER_INPUT_VALUE,
              payload: val,
            })
          }
          inputValue={state.userInputValue}
          onMaxClick={(val) =>
            dispatch({
              type: Actions.SET_USER_INPUT_VALUE,
              payload: toFixed(Number(val), 4),
            })
          }
        />
        {state.selectedTab === 'withdraw' ? (
          <div className="withdraw-details-area">
            {state.withdrawType === 'instant' ? (
              <WithdrawDetail
                label="Available to withdraw"
                icon="tooltip-icon"
                amount={Number(state.balances.withdraw.instantBalance).toFixed(
                  4,
                )}
                unit={state.selectedAsset.toUpperCase()}
              />
            ) : (
              <>
                <WithdrawDetail
                  label="Complete withdrawal"
                  icon="tooltip-icon"
                  amount={toFixed(
                    Number(
                      state.balances.withdraw.requestBalance
                        .fundsAvailableToWithdraw,
                    ),
                    4,
                  )}
                  unit={state.selectedAsset.toUpperCase()}
                  tooltip={`The assets that you requested to withdraw are available.`}
                />
                <WithdrawDetail
                  label="Funds in queue"
                  icon="tooltip-icon"
                  amount={toFixed(
                    Number(state.balances.withdraw.requestBalance.fundsInQueue),
                    4,
                  )}
                  unit={state.selectedAsset.toUpperCase()}
                  tooltip={`Your assets that are currently active in a vault and can only be withdrawn at the end of the epoch.`}
                />
                <WithdrawDetail
                  label="Funds in active use"
                  icon="tooltip-icon"
                  amount={toFixed(
                    Number(
                      state.balances.withdraw.requestBalance.fundsInActiveUse,
                    ),
                    4,
                  )}
                  unit={state.selectedAsset.toUpperCase()}
                  tooltip={`Your total assets that are currently active in vaults making you money brrrrrrrr.`}
                />
              </>
            )}
          </div>
        ) : null}
        {isConnected ? (
          <>
            {state.selectedAssetApproved ? null : (
              <div
                className="error-area"
                style={{ background: 'var(--contained-tab-background)' }}
              >
                <div className="error-title">
                  <Sprite id="guide-icon" width={17} height={16} />
                  <label
                    className="title-label"
                    style={{ color: 'var(--link-inactive)' }}
                  >
                    Guide
                  </label>
                </div>
                <p
                  className="error-text"
                  style={{ color: 'var(--link-inactive)' }}
                >
                  You will be asked to approve this currency from your wallet.
                  You will need to approve each currency only once.
                </p>
              </div>
            )}
            {state.appError ? (
              <div className="error-area">
                <div className="error-title">
                  <Sprite id="error-icon" width={17} height={16} />
                  <label className="title-label">ERROR</label>
                </div>
                <p className="error-text">{state.appError}</p>
              </div>
            ) : null}
          </>
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
            onClick={
              state.selectedAssetApproved
                ? () => setOpenConfirm(true)
                : () =>
                    dispatch({
                      type: Actions.SET_APPROVE_TOKEN_MODAL,
                      payload: true,
                    })
            }
            disabled={
              (Number(state.userInputValue) <= 0 &&
                state.selectedAssetApproved) ||
              state.transactionDetails.loading
            }
          >
            {state.transactionDetails.loading
              ? 'Pending Transaction'
              : state.selectedAssetApproved
              ? `Preview ${
                  state.selectedTab === 'deposit' ? 'Deposit' : 'Withdraw'
                }`
              : `Approve ${state.selectedAsset.toUpperCase()}`}
          </Button>
        )}
        {/* <label className="sub-text">
          Need help? <span className="link">Learn from video tutorials</span>
        </label> */}
        <ConfirmStake
          open={openConfirm}
          hide={() => setOpenConfirm(false)}
          amount={state.userInputValue}
          onConfirm={() => onConfirm()}
        />
        <TransactionDetail
          open={openTransactionDetail}
          hide={() => setOpenTransactionDetail(false)}
        />
      </Card>
      {isConnected && state.selectedAsset !== Assets.ETH ? (
        <Card
          className="mint-tokens-card"
          style={{
            border:
              connector?.id.toLowerCase() === 'metamask' ||
              state.connectedNetwork.networkEnv === 'testnet'
                ? ''
                : 'none',
          }}
        >
          {connector?.id.toLowerCase() === 'metamask' ? (
            <div
              className="mint-tokens-label"
              onClick={addToken}
              style={{
                paddingBottom:
                  state.connectedNetwork.networkEnv === 'mainnet' ? rem(16) : 0,
              }}
            >
              Show {state.selectedAsset.toUpperCase()} in wallet
            </div>
          ) : null}
          {state.connectedNetwork.networkEnv === 'testnet' ? (
            <Button
              className="mint-tokens-button"
              style={{
                background:
                  openConfirm ||
                  state.transactionDetails.loading ||
                  state.appError !== ''
                    ? `var(--vault-card-border)`
                    : `var(--${state.selectedAsset}-mint-button-background)`,
              }}
              disabled={
                openConfirm ||
                state.transactionDetails.loading ||
                state.appError !== ''
              }
              onClick={mintToken}
            >
              Mint {state.selectedAsset.toUpperCase()} on Testnet
              <Sprite id="mint-tokens-icon" width={20} height={21} />
            </Button>
          ) : null}
        </Card>
      ) : null}
      <Modal
        open={state.approveTokenModal}
        hide={() =>
          dispatch({ type: Actions.SET_APPROVE_TOKEN_MODAL, payload: false })
        }
      >
        <div className="approve-token-modal">
          <div className="approve-modal-header">
            <Sprite
              id={`big-${state.selectedAsset}-icon`}
              width={48}
              height={48}
            />
            <p
              style={{
                color: 'var(--link-inactive)',
                fontSize: rem(24),
                cursor: 'pointer',
              }}
              onClick={() =>
                dispatch({
                  type: Actions.SET_APPROVE_TOKEN_MODAL,
                  payload: false,
                })
              }
            >
              &#10005;
            </p>
          </div>
          <div className="approve-modal-content">
            <label className="modal-content-title">Approve Currency</label>
            <p className="modal-content-desc">
              You will be asked to approve this currency from your wallet. You
              will need to approve each currency only once.
            </p>
          </div>
          <Button className="approve-button" onClick={approveToken}>
            Continue
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default StakeCard

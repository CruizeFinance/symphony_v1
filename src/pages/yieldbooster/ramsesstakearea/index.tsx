import './ramsesstakearea.scss'
import {
  Button,
  Card,
  Input,
  Modal,
  Sprite,
  Tabs,
  Tooltip,
} from '../../../components'
import ConfirmStake from './ramsesconfirmstake'
import { useContext, useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { erc20ABI, useAccount, useSigner } from 'wagmi'
import { AppContext } from '../../../context'
import { BigNumber, Contract, Signer, ethers } from 'ethers'
import { Actions } from '../../../enums/actions'
import {
  CONTRACT_CONFIG,
  RAMSES_VAULT_CONTRACT_CONFIG,
  rem,
  toFixed,
} from '../../../utils'
import { TransactionReceipt, TransactionResponse } from '../../../interfaces'
import TransactionDetail from '../../twinpeaks/stakearea/transactiondetail'
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

const RamsesStakeCard = () => {
  const [state, dispatch] = useContext(AppContext)

  const { isConnected, address } = useAccount()
  const { data: signer } = useSigner()

  const [openConfirm, setOpenConfirm] = useState(false)
  const [openTransactionDetail, setOpenTransactionDetail] = useState(false)
  const [assetOneInput, setAssetOneInput] = useState('')
  const [assetTwoInput, setAssetTwoInput] = useState('')
  const [lpInput, setLpInput] = useState('')
  const [assetOneContract, setAssetOneContract] = useState<Contract | null>(
    null,
  )
  const [assetTwoContract, setAssetTwoContract] = useState<Contract | null>(
    null,
  )
  const [lpContract, setLpContract] = useState<Contract | null>(null)
  const [balanceLoaded, setBalanceLoaded] = useState(false)

  const getBalance = async () => {
    try {
    const balanceOne = await assetOneContract!.balanceOf(address)
    const balanceTwo = await assetTwoContract!.balanceOf(address)
    const balanceLp = await lpContract!.balanceOf(address)

    dispatch({
      type: Actions.SET_RAMSES_VAULT_PAIR,
      payload: {
        ...state.ramsesVaultSelection,
        assetOne: {
          ...state.ramsesVaultSelection.assetOne,
          balance: ethers.utils.formatUnits(
            balanceOne as BigNumber,
            RAMSES_VAULT_CONTRACT_CONFIG[
              `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
            ].assetOne.decimals,
          ),
        },
        assetTwo: {
          ...state.ramsesVaultSelection.assetTwo,
          balance: ethers.utils.formatUnits(
            balanceTwo as BigNumber,
            RAMSES_VAULT_CONTRACT_CONFIG[
              `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
            ].assetTwo.decimals,
          ),
        },
        lp: {
          ...state.ramsesVaultSelection.lp,
          balance: ethers.utils.formatUnits(
            balanceLp as BigNumber,
            RAMSES_VAULT_CONTRACT_CONFIG[
              `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
            ].lp.decimals,
          ),
        },
      },
    })

    setBalanceLoaded(true)
  } catch (e) {
    resetTransactionDetails()
  }
  }

  const checkAllowance = async () => {
    try {
      const approvedOne: BigNumber = await assetOneContract!.allowance(
        address!,
        RAMSES_VAULT_CONTRACT_CONFIG[
          `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
        ].contract,
      )
      const approvedTwo: BigNumber = await assetTwoContract!.allowance(
        address!,
        RAMSES_VAULT_CONTRACT_CONFIG[
          `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
        ].contract,
      )
      const approvedLp: BigNumber = await lpContract!.allowance(
        address!,
        RAMSES_VAULT_CONTRACT_CONFIG[
          `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
        ].contract,
      )
      dispatch({
        type: Actions.SET_RAMSES_VAULT_PAIR,
        payload: {
          ...state.ramsesVaultSelection,
          assetOne: {
            ...state.ramsesVaultSelection.assetOne,
            approved: BigNumber.from(approvedOne).gt(BigNumber.from(0)),
          },
          assetTwo: {
            ...state.ramsesVaultSelection.assetTwo,
            approved: BigNumber.from(approvedTwo).gt(BigNumber.from(0)),
          },
          lp: {
            ...state.ramsesVaultSelection.lp,
            approved: BigNumber.from(approvedLp).gt(BigNumber.from(0)),
          },
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

  const approveToken = async (token: 'assetOne' | 'assetTwo' | 'lp') => {
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
      const tx =
        token === 'assetOne'
          ? await assetOneContract!.approve(
              RAMSES_VAULT_CONTRACT_CONFIG[
                `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
              ].contract,
              ethers.constants.MaxUint256,
            )
          : token === 'assetTwo'
          ? await assetTwoContract!.approve(
              RAMSES_VAULT_CONTRACT_CONFIG[
                `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
              ].contract,
              ethers.constants.MaxUint256,
            )
          : await lpContract!.approve(
              RAMSES_VAULT_CONTRACT_CONFIG[
                `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
              ].contract,
              ethers.constants.MaxUint256,
            )
      dispatch({ type: Actions.SET_APPROVE_TOKEN_MODAL, payload: false })
      const data = await transactionExecution(tx, 'approve')
      dispatch({
        type: Actions.SET_RAMSES_VAULT_PAIR,
        payload: {
          ...state.ramsesVaultSelection,
          [token]: {
            ...state.ramsesVaultSelection[token],
            approved: (data as TransactionReceipt).status === 1,
          },
        },
      })
    } catch (e) {
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: 'The transaction was cancelled and could not be completed',
      })
    }
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
        state.selectedTab === 'deposit' ? 'deposit' : 'withdraw',
        state.selectedTab === 'deposit'
          ? [
              ethers.utils.parseUnits(
                assetOneInput || '0',
                RAMSES_VAULT_CONTRACT_CONFIG[
                  `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
                ].assetOne.decimals,
              ),
              ethers.utils.parseUnits(
                assetTwoInput || '0',
                RAMSES_VAULT_CONTRACT_CONFIG[
                  `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
                ].assetTwo.decimals,
              ),
            ]
          : [],
      )
    } catch (e) {
      resetTransactionDetails()
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: (e as { message: string }).message,
      })
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
      const tx = await state.ramsesVaultContract![functionName](...args)
      await transactionExecution(tx, 'transaction')
    } catch (e) {
      resetTransactionDetails()
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: 'The transaction was cancelled and could not be completed',
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
    setLpInput('')
    setAssetOneInput('')
    setAssetTwoInput('')
    setOpenConfirm(false)
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
      resetTransactionDetails()
      dispatch({
        type: Actions.SET_APP_ERROR,
        payload: (e as { message: string }).message,
      })
    }
  }

  useEffect(() => {
    if (state.appError) {
      const timeout = setTimeout(() => {
        dispatch({ type: Actions.SET_APP_ERROR, payload: '' })
        clearTimeout(timeout)
      }, 7000)
    }
  }, [state.appError])

  useEffect(() => {
    if (balanceLoaded) {
      setBalanceLoaded(false)
      if (
        !state.ramsesVaultSelection.assetOne.approved ||
        !state.ramsesVaultSelection.assetTwo.approved
      )
        checkAllowance()
    }
  }, [
    balanceLoaded,
    state.ramsesVaultSelection.assetOne.approved,
    state.ramsesVaultSelection.assetTwo.approved,
  ])

  useEffect(() => {
    if (assetOneContract && assetTwoContract) {
      getBalance()
    }
  }, [assetOneContract, assetTwoContract, state.transactionDetails, state.ramsesDepositType])

  useEffect(() => {
    if (signer && isConnected) {
      const assetOneContract = new ethers.Contract(
        RAMSES_VAULT_CONTRACT_CONFIG[
          `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
        ].assetOne.contract,
        erc20ABI,
        signer as Signer,
      )
      setAssetOneContract(assetOneContract)
      const assetTwoContract = new ethers.Contract(
        RAMSES_VAULT_CONTRACT_CONFIG[
          `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
        ].assetTwo.contract,
        erc20ABI,
        signer as Signer,
      )
      setAssetTwoContract(assetTwoContract)
      const lpContract = new ethers.Contract(
        RAMSES_VAULT_CONTRACT_CONFIG[
          `${state.ramsesVaultSelection.assetOne.name}-${state.ramsesVaultSelection.assetTwo.name}` as keyof typeof RAMSES_VAULT_CONTRACT_CONFIG
        ].lp.contract,
        erc20ABI,
        signer as Signer,
      )
      setLpContract(lpContract)
    }
  }, [signer, isConnected])

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
        {state.selectedTab === 'deposit' ? (
          <Tabs
            tabs={[
              {
                label: 'standard',
              },
              {
                label: 'lp',
              },
            ]}
            onChange={(val) => {
              dispatch({
                type: Actions.SET_USER_INPUT_VALUE,
                payload: '',
              })
              dispatch({
                type: Actions.SET_RAMSES_DEPOSIT_TYPE,
                payload: val,
              })
            }}
            type="contained"
            defaultTab={state.ramsesDepositType}
          />
        ) : null}
        {state.selectedTab === 'deposit' ? (
          state.ramsesDepositType === 'standard' ? (
            <div className="input-area">
              <Input
                onInputChange={(val) => setAssetOneInput(val)}
                inputValue={assetOneInput}
                onMaxClick={(val) => setAssetOneInput(toFixed(Number(val), 4))}
                showAsset={state.ramsesVaultSelection.assetOne.name}
                assetApproved={state.ramsesVaultSelection.assetOne.approved}
                balance={state.ramsesVaultSelection.assetOne.balance}
              />
              <Input
                onInputChange={(val) => setAssetTwoInput(val)}
                inputValue={assetTwoInput}
                onMaxClick={(val) => setAssetTwoInput(toFixed(Number(val), 4))}
                showAsset={state.ramsesVaultSelection.assetTwo.name}
                hideLabel
                assetApproved={state.ramsesVaultSelection.assetTwo.approved}
                balance={state.ramsesVaultSelection.assetTwo.balance}
              />
              <div className="input-area-plus-icon">
                <img
                  src="/assets/icons/ramses-stake-area-plus-icon.png"
                  alt="icon"
                  width={32}
                  height={32}
                />
              </div>
            </div>
          ) : (
            <Input
              onInputChange={(val) => setLpInput(val)}
              inputValue={lpInput}
              onMaxClick={(val) => setLpInput(toFixed(Number(val), 4))}
              showAsset={state.ramsesVaultSelection.lp.name}
              hideLabel
              hideDollarValue
              assetApproved={state.ramsesVaultSelection.lp.approved}
              balance={state.ramsesVaultSelection.lp.balance}
            />
          )
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
              state.ramsesDepositType === 'standard' &&
              (!state.ramsesVaultSelection.assetOne.approved ||
                !state.ramsesVaultSelection.assetTwo.approved)
                ? () =>
                    dispatch({
                      type: Actions.SET_APPROVE_TOKEN_MODAL,
                      payload: true,
                    })
                : state.ramsesDepositType === 'lp' &&
                  !state.ramsesVaultSelection.lp.approved
                ? () =>
                    dispatch({
                      type: Actions.SET_APPROVE_TOKEN_MODAL,
                      payload: true,
                    })
                : () => setOpenConfirm(true)
            }
            disabled={
              state.selectedTab === 'deposit'
                ? state.ramsesDepositType === 'standard'
                  ? (state.ramsesVaultSelection.assetOne.approved &&
                      !assetOneInput &&
                      state.ramsesVaultSelection.assetTwo.approved &&
                      !assetTwoInput) ||
                    state.transactionDetails.loading
                  : state.ramsesDepositType === 'lp'
                  ? state.ramsesVaultSelection.lp.approved && !lpInput
                  : state.transactionDetails.loading
                : state.transactionDetails.loading
            }
          >
            {state.transactionDetails.loading
              ? 'Pending Transaction'
              : state.ramsesDepositType === 'standard'
              ? !state.ramsesVaultSelection.assetOne.approved
                ? `Approve ${state.ramsesVaultSelection.assetOne.name.toUpperCase()}`
                : !state.ramsesVaultSelection.assetTwo.approved
                ? `Approve ${state.ramsesVaultSelection.assetTwo.name.toUpperCase()}`
                : 'View Details'
              : !state.ramsesVaultSelection.lp.approved
              ? `Approve LP Token`
              : 'View Details'}
          </Button>
        )}
        <ConfirmStake
          open={openConfirm}
          hide={() => setOpenConfirm(false)}
          {...(state.ramsesDepositType === 'lp'
            ? { amountOne: lpInput, amountTwo: '' }
            : { amountOne: assetOneInput, amountTwo: assetTwoInput })}
          onConfirm={() => onConfirm()}
        />
        <TransactionDetail
          open={openTransactionDetail}
          hide={() => setOpenTransactionDetail(false)}
          {...(state.selectedTab === 'withdraw'
            ? { style: { height: 'auto' } }
            : undefined)}
        />
      </Card>
      <Modal
        open={state.approveTokenModal}
        hide={() =>
          dispatch({ type: Actions.SET_APPROVE_TOKEN_MODAL, payload: false })
        }
      >
        <div className="approve-token-modal">
          <div className="approve-modal-header">
            {state.ramsesDepositType === 'lp' ? (
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
            ) : (
              <Sprite
                id={`big-${
                  !state.ramsesVaultSelection.assetOne.approved
                    ? state.ramsesVaultSelection.assetOne.name
                    : state.ramsesVaultSelection.assetTwo.name
                }-icon`}
                width={48}
                height={48}
              />
            )}
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
          <Button
            className="approve-button"
            onClick={() =>
              approveToken(
                !state.ramsesVaultSelection.assetOne.approved
                  ? 'assetOne'
                  : !state.ramsesVaultSelection.assetTwo.approved
                  ? 'assetTwo'
                  : 'lp',
              )
            }
          >
            Continue
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default RamsesStakeCard
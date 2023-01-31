import './stakearea.scss'
import { Button, Card, Input, Sprite, Tabs } from '../../../components'
import ConfirmStake from './confirmstake'
import { useContext, useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { AppContext } from '../../../context'
import { BigNumber, ethers } from 'ethers'
import { Actions } from '../../../enums/actions'
import { CONTRACT_CONFIG } from '../../../utils'
import { TransactionReceipt, TransactionResponse } from '../../../interfaces'

interface DepositReceiptsInterface {
  round: number
  amount: BigNumber
  unredeemedShares: BigNumber
}

const StakeCard = () => {
  const { address, isConnected } = useAccount()

  const [state, dispatch] = useContext(AppContext)

  const [openConfirm, setOpenConfirm] = useState(false)

  /*
   * a function to get user balance of the asset
   */
  const getBalance = async () => {
    let balance: BigNumber | DepositReceiptsInterface
    if (state.selectedTab === 'withdraw') {
      balance = await state.cruizeContract!.depositReceipts(
        address,
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].address,
      )
    } else {
      balance = await state.selectedAssetContract!.balanceOf(address)
    }
    dispatch({
      type: Actions.SET_ASSET_BALANCE,
      payload: ethers.utils.formatUnits(
        state.selectedTab === 'withdraw'
          ? ((balance as DepositReceiptsInterface).amount as BigNumber)
          : (balance as BigNumber),
        CONTRACT_CONFIG[state.connectedNetwork.chainId][
          state.selectedAsset.toUpperCase()
        ].decimals,
      ),
    })
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
          type: 'approve'
        },
      })
      const tx = await state.selectedAssetContract!.approve(
        CONTRACT_CONFIG[state.connectedNetwork.chainId]['CRUIZE_CONTRACT']
          .address,
        ethers.constants.MaxUint256,
      )
      const data: TransactionReceipt = await transactionExecution(tx, 'approve')
      dispatch({
        type: Actions.SET_SELCTED_ASSET_APPROVED,
        payload: data.status === 1,
      })
    } catch (e: any) {
      dispatch({type: Actions.SET_APP_ERROR, payload: e.message})
      resetTransactionDetails()
    }
  }

  const transactionExecution = async (tx: TransactionResponse, type: string) => {
    dispatch({
      type: Actions.SET_TRANSACTION_DETAILS,
      payload: {
        ...state.transactionDetails,
        loading: true,
        hash: tx.hash,
        type
      },
    })
    const data: TransactionReceipt = await tx.wait()
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
          amount: ethers.utils.parseUnits(
            state.userInputValue,
            CONTRACT_CONFIG[state.connectedNetwork.chainId][
              state.selectedAsset.toUpperCase()
            ].decimals,
          ).toString(),
        },
        ...state.transactionData,
      ],
    })
    dispatch({
      type: Actions.SET_TRANSACTION_DETAILS,
      payload: {
        ...state.transactionDetails,
        loading: false,
        hash: '',
        status: 0,
      },
    })
    setOpenConfirm(false)
    dispatch({
      type: Actions.SET_USER_INPUT_VALUE,
      payload: '',
    })
    return data
  }

  const resetTransactionDetails = () => {
    dispatch({
      type: Actions.SET_TRANSACTION_DETAILS,
      payload: {
        loading: false,
        hash: '',
        status: 0,
        type: '',
      },
    })
    dispatch({
      type: Actions.SET_USER_INPUT_VALUE,
      payload: '',
    })
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
        state.selectedTab === 'withdraw' ? 'instantWithdraw' : 'deposit',
        [
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
    } catch (e: any) {
      dispatch({type: Actions.SET_APP_ERROR, payload: e.message})
      resetTransactionDetails()
    }
  }

  const writeContract = async (
    functionName: string,
    args: Array<BigNumber | string>,
  ) => {
    try {
      const tx = await state.cruizeContract![functionName](...args)
      await transactionExecution(tx, 'transaction')
    } catch (e: any) {
      dispatch({type: Actions.SET_APP_ERROR, payload: e.message})
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
        },
      })
      const tx = await state.mintTokenContract!.mint(
        ethers.utils.parseUnits(
          state.selectedAsset === 'usdc' ? '100' : '1',
          CONTRACT_CONFIG[state.connectedNetwork.chainId][
            state.selectedAsset.toUpperCase()
          ].decimals || '',
        ),
      )
      await transactionExecution(tx, 'mint')
    } catch (e: any) {
      dispatch({type: Actions.SET_APP_ERROR, payload: e.message})
      resetTransactionDetails()
    }
  }

  useEffect(() => {
    if (state.selectedAssetContract) {
      getBalance()
    }
  }, [
    state.selectedTab,
    state.selectedAsset,
    state.selectedAssetContract,
    address,
    state.transactionDetails,
  ])

  useEffect(() => {
    if (state.appError) {
      const timeout = setTimeout(() => {
        dispatch({type: Actions.SET_APP_ERROR, payload: ''})
        clearTimeout(timeout)
      }, 7000)
    }
  }, [state.appError])

  return (
    <>
      <Card className="stake-card">
        <Tabs
          onChange={() =>
            dispatch({
              type: Actions.SET_USER_INPUT_VALUE,
              payload: '',
            })
          }
        />
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
              payload: val,
            })
          }
        />
        {state.appError ? (
          <div className="error-area">
            <div className="error-title">
              <Sprite id="error-icon" width={17} height={16} />
              <label className="title-label">ERROR</label>
            </div>
            <p className="error-text">{state.appError}</p>
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
            onClick={
              state.selectedAssetApproved
                ? () => setOpenConfirm(true)
                : () => approveToken()
            }
            disabled={
              Number(state.userInputValue) <= 0 ||
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
      </Card>
      {isConnected ? (
        <Card className="mint-tokens-card">
          <label className="mint-tokens-label">Add tokens to wallet</label>
          <Button
            className="mint-tokens-button"
            style={{
              background:
                openConfirm || state.transactionDetails.loading || state.appError !== ''
                  ? `var(--vault-card-border)`
                  : `var(--${state.selectedAsset}-mint-button-background)`,
            }}
            disabled={
              openConfirm || state.transactionDetails.loading || state.appError !== ''
            }
            onClick={mintToken}
          >
            Mint {state.selectedAsset.toUpperCase()} on Testnet
            <Sprite id="mint-tokens-icon" width={20} height={21} />
          </Button>
        </Card>
      ) : null}
    </>
  )
}

export default StakeCard

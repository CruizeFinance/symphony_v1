import { useContext, useEffect, useRef, useState } from 'react'
import { useSwitchNetwork } from 'wagmi'
import { Sprite } from '../../../components'
import { AppContext } from '../../../context'
import { Actions } from '../../../enums/actions'
import { useOutsideAlerter } from '../../../hooks'
import { NETWORK_CONFIG } from '../../../utils'
import './networkdropdown.scss'

const NetworkDropdown = () => {
  const [state, dispatch] = useContext(AppContext)

  const {
    data: switchData,
    switchNetwork,
    isSuccess: isSwitchSuccess,
  } = useSwitchNetwork()

  const networkRef = useRef(null)
  useOutsideAlerter(networkRef, () => setShowNetworks(false))

  const [showNetworks, setShowNetworks] = useState(false)

  const onClick = async (val: typeof NETWORK_CONFIG.TESTNET.ethereum) => {
    try {
      switchNetwork?.(val.chainId)
      setShowNetworks(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (isSwitchSuccess)
      dispatch({
        type: Actions.SET_CONNECTED_NETWORK,
        payload: Object.values(NETWORK_CONFIG.TESTNET).filter(
          (net) => net.chainId === switchData?.id,
        )[0],
      })
  }, [isSwitchSuccess])

  return (
    <div className="network-dropdown" ref={networkRef}>
      <div className="picker" onClick={() => setShowNetworks(!showNetworks)}>
        <img
          src={`/assets/network/${state.connectedNetwork?.icon}-network-icon.png`}
          alt="network-icon"
          width={24}
          height={24}
        />
        <label className="picker-label">{state.connectedNetwork?.label}</label>
        <Sprite
          id="dropdown-expand-icon"
          width={24}
          height={24}
          {...(showNetworks
            ? { style: { transform: 'rotate(180deg)' } }
            : undefined)}
        />
      </div>
      {showNetworks ? (
        <div className={`options`}>
          {Object.values(NETWORK_CONFIG.TESTNET).map((network, index) => (
            <div
              className={`option  ${
                state.connectedNetwork.chainId === network.chainId
                  ? 'selected'
                  : ''
              }`}
              key={`${network}-${index}`}
              onClick={() => onClick(network)}
            >
              <div className="network-details">
                <img
                  src={`/assets/network/${network.icon}-network-icon.png`}
                  alt={`${network}-network-icon`}
                  width={28}
                  height={28}
                />
                <label className="network-label">{network.label}</label>
              </div>
              {state.connectedNetwork.chainId === network.chainId ? (
                <div className="connected-area">
                  <label className="connected-label">Connected</label>
                  <Sprite id="connected-dot-icon" width={6} height={6} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default NetworkDropdown

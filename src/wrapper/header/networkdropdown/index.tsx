import { useContext, useEffect, useRef, useState } from 'react'
import { useSwitchNetwork } from 'wagmi'
import { getTVL } from '../../../apis'
import { Sprite } from '../../../components'
import { AppContext } from '../../../context'
import { Actions } from '../../../enums/actions'
import { useOutsideAlerter } from '../../../hooks'
import { NetworkConfigDetail } from '../../../interfaces'
import { NETWORK_CONFIG } from '../../../utils'
import './networkdropdown.scss'

const NetworkDropdown = () => {
  const [state, dispatch] = useContext(AppContext)

  const { switchNetworkAsync } = useSwitchNetwork()

  const networkRef = useRef(null)
  useOutsideAlerter(networkRef, () => setShowNetworks(false))

  const [showNetworks, setShowNetworks] = useState(false)

  const onClick = async (val: NetworkConfigDetail) => {
    try {
      await switchNetworkAsync?.(val.chainId)
      dispatch({
        type: Actions.SET_CONNECTED_NETWORK,
        payload: Object.values(NETWORK_CONFIG)
          .flatMap((innerObj) => Object.values(innerObj))
          .filter((net) => net.chainId === val.chainId)[0],
      })
      setShowNetworks(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="network-dropdown" ref={networkRef}>
      <div
        className="network-picker"
        onClick={() => setShowNetworks(!showNetworks)}
      >
        <img
          src={`/assets/network/${state.connectedNetwork?.icon}-network-icon.png`}
          alt="network-icon"
          width={24}
          height={24}
        />
        <label className="network-picker-label">
          {state.connectedNetwork?.label}
        </label>
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
        <div className={`network-options`}>
          {Object.values(NETWORK_CONFIG)
            .flatMap((innerObj) => Object.values(innerObj))
            .map((network) => (
              <div
                className={`network-option  ${
                  state.connectedNetwork.chainId === network.chainId
                    ? 'selected-network'
                    : ''
                }`}
                key={`${network.chainId}`}
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
                  <div className="network-connected-area">
                    <label className="network-connected-label">Connected</label>
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

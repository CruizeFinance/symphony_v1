import { CSSProperties, useContext, useEffect, useRef, useState } from 'react'
import { getAssetPrice } from '../../apis'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import { useOutsideAlerter } from '../../hooks'
import { API_PARAMS, DROPDOWN_OPTIONS } from '../../utils'
import Sprite from '../sprite'
import './assetdropdown.scss'

interface AssetDropdownProps {
  type?: 'big' | 'small'
  onChange?: (val: string) => void
  pickerClass?: string
  optionsClass?: string
  pickerStyle?: CSSProperties
  optionsStyle?: CSSProperties
}

const AssetDropdown = ({
  type,
  onChange,
  pickerClass,
  pickerStyle,
  optionsClass,
  optionsStyle,
}: AssetDropdownProps) => {
  const [state, dispatch] = useContext(AppContext)

  const dropdownRef = useRef(null)
  useOutsideAlerter(dropdownRef, () => setOpenOptions(false))

  const [openOptions, setOpenOptions] = useState(false)

  const onClick = (val: string) => {
    onChange && onChange(val)
    dispatch({ type: Actions.SET_SELECTED_ASSET, payload: val })
    setOpenOptions(false)
    setAssetPrice(API_PARAMS[val as typeof state.selectedAsset])
    dispatch({ type: Actions.SET_BG_COLOR_VALUE, payload: val })
  }

  const setAssetPrice = async (val: string) => {
    const response = await getAssetPrice(val)
    dispatch({ type: Actions.SET_ASSET_PRICE, payload: response.price })
  }

  return (
    <div className={'dropdown-container'} ref={dropdownRef}>
      <div
        className={`dropdown ${type || 'small'} ${pickerClass || ''}`}
        onClick={() => setOpenOptions(!openOptions)}
        style={{ ...pickerStyle }}
      >
        <Sprite
          id={`${type === 'big' ? 'big-' : ''}${state.selectedAsset}-icon`}
          width={type === 'big' ? 61 : 32}
          height={type === 'big' ? 61 : 32}
        />
        {state.selectedAsset}
        <Sprite
          id="dropdown-expand-icon"
          width={type === 'big' ? 30 : 14}
          height={type === 'big' ? 30 : 14}
          {...(openOptions
            ? { style: { transform: 'rotate(180deg)' } }
            : undefined)}
        />
      </div>
      {openOptions ? (
        <div
          className={`options ${optionsClass || ''}`}
          style={{ ...optionsStyle }}
        >
          {DROPDOWN_OPTIONS.map((opt, index) => (
            <div
              key={`${opt}-${index}`}
              className={`option ${
                state.selectedAsset === opt ? 'selected' : ''
              }`}
              onClick={() => onClick(opt)}
            >
              <Sprite id={`${opt}-icon`} width={30} height={30} />
              <label className="label">{opt}</label>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default AssetDropdown

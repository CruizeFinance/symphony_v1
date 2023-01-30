import { useContext } from 'react'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import './tabs.scss'

interface TabsProps {
  onChange?: (val: string) => void
}

const Tabs = ({ onChange }: TabsProps) => {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div className="tabs-container">
      <div
        className={`tab outlined ${
          state.selectedTab === 'deposit' ? 'selected' : ''
        }`}
        onClick={() => {
          dispatch({ type: Actions.SET_SELECTED_TAB, payload: 'deposit' })
          onChange && onChange('deposit')
        }}
      >
        <label className="label">deposit</label>
      </div>
      <div
        className={`tab outlined ${
          state.selectedTab === 'withdraw' ? 'selected' : ''
        }`}
        onClick={() => {
          dispatch({ type: Actions.SET_SELECTED_TAB, payload: 'withdraw' })
          onChange && onChange('withdraw')
        }}
      >
        <label className="label">withdraw</label>
      </div>
    </div>
  )
}

export default Tabs

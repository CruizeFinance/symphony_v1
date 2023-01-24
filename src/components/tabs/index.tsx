import { useContext } from 'react'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import './tabs.scss'

const Tabs = () => {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div className="tabs-container">
      <div
        className={`tab outlined ${
          state.selectedTab === 'deposit' ? 'selected' : ''
        }`}
        onClick={() =>
          dispatch({ type: Actions.SET_SELECTED_TAB, payload: 'deposit' })
        }
      >
        <label className="label">deposit</label>
      </div>
      <div
        className={`tab outlined ${
          state.selectedTab === 'withdraw' ? 'selected' : ''
        }`}
        onClick={() =>
          dispatch({ type: Actions.SET_SELECTED_TAB, payload: 'withdraw' })
        }
      >
        <label className="label">withdraw</label>
      </div>
    </div>
  )
}

export default Tabs

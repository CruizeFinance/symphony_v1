import { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sprite } from '../../components'
import FaqCard from './faqcard'
import './twinpeaks.scss'
import StakeArea from './stakearea'
import StrategyCard from './strategycard'
import YieldInfoCard from './yieldinfocard'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import { Assets } from '../../enums/assets'

const TwinPeaks = () => {
  const [state, dispatch] = useContext(AppContext)

  const navigate = useNavigate()

  const location = useLocation()

  const path = location.pathname
  let vaultAsset = ''
  if (path.includes('twinpeaks')) {
    vaultAsset = path.split('twinpeaks/')[1]
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    if (vaultAsset) {
      // Sets up the vault page for the desired asset if directed from an external website.
      // The 1st dispatch is setting the Background color for the asset in the url path and the 2nd dispatch is seelcting the asset in dropdown.
      dispatch({
        type: Actions.SET_BG_COLOR_VALUE,
        payload: vaultAsset,
      })
      dispatch({
        type: Actions.SET_SELECTED_ASSET,
        payload: vaultAsset,
      })
    } else {
      // This is setting up the default asset on the vault page if the pathname does not have any asset or twinpeaks in it i.e if vault was for ramses-yield-booster.
      dispatch({
        type: Actions.SET_BG_COLOR_VALUE,
        payload: state.selectedAsset,
      })
    }
  }, [])

  return (
    <div className="principal-container">
      <div className="principal">
        <button className="back-button" onClick={() => navigate('/')}>
          <Sprite id="chevron-left-icon" width={5} height={10} />
          Back to Home
        </button>
        <div className="container">
          <div className="info-col">
            <h1 className="title">Protected Twin Peaks</h1>
            <StrategyCard />
            <YieldInfoCard />
            <FaqCard />
          </div>
          <div className="stake-area">
            <StakeArea />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwinPeaks

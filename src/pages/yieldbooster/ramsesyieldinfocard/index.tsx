import { useContext, useEffect } from 'react'
import { loadYieldInfoGraph } from '../../../apis'
import { Card } from '../../../components'
import { AppContext } from '../../../context'
import { Actions } from '../../../enums/actions'
import './ramsesyieldinfocard.scss'

const RamsesYieldInfoCard = () => {
  const [state, dispatch] = useContext(AppContext)

  const getYieldInfoData = async () => {
    const data = await loadYieldInfoGraph(
      'protected_twin_peaks',
      state.selectedAsset.toUpperCase(),
    )
    dispatch({
      type: Actions.SET_YIELD_INFO_DATA,
      payload: {
        pcg_moved: data.message?.pcg_moved,
        results: data.message?.results,
      },
    })
  }

  useEffect(() => {
    if (state.selectedAsset) getYieldInfoData()
  }, [state.selectedAsset])

  return (
    <Card className="yield-info-card">
      <div className="card-header">
        <label className="yield-info-label">How does it work?</label>
      </div>
      <div className="card-content">
        <p className="yield-info-text">
          A portion of your earnings from Ramses is used to boost your base
          yield
        </p>
        <img
          src="/assets/icons/ramses-yield-icon.png"
          alt="yeild-info-icon"
          width={'100%'}
          height={'auto'}
        />
      </div>
    </Card>
  )
}

export default RamsesYieldInfoCard

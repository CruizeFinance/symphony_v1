import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Sprite } from '../../components'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import './pagenotfound.scss'

const PageNotFound = () => {
  const [, dispatch] = useContext(AppContext)

  const navigate = useNavigate()

  useEffect(() => {
    dispatch({ type: Actions.SET_BG_COLOR_VALUE, payload: 'vault' })
  }, [])

  return (
    <div className="page-not-found">
      <div className="not-found-content">
        <div className="not-found-details">
          <img
            src="/assets/portfolio/confused-portfolio-icon.svg"
            alt="confused-portfolio-icon"
            width={266}
            height={266}
          />
          <label className="not-found-title">Page not found</label>
          <p className="not-found-desc">
            The page you are looking for doesn't exist.
            <br />
            Here are some helpful links:
          </p>
        </div>
        <div className="buttons-container">
          <Button
            className="go-back-button"
            onClick={() => window.history.back()}
          >
            <Sprite
              id="arrow-left-icon"
              width={24}
              height={24}
              style={{ transform: 'rotate(180deg)' }}
            />
            Go back
          </Button>
          <Button className="go-home-button" onClick={() => navigate('/')}>
            Go to home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound

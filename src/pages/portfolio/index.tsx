import { useContext, useEffect } from 'react'
import { AppContext } from '../../context'
import { Actions } from '../../enums/actions'
import './portfolio.scss'

const Portfolio = () => {
  const [, dispatch] = useContext(AppContext)

  useEffect(() => {
    dispatch({ type: Actions.SET_BG_COLOR_VALUE, payload: 'portfolio' })
  }, [])

  return (
    <div className="portfolio">
      <p className="text">Building</p>
      <img
        src="/assets/portfolio/sleeping-portfolio-icon.svg"
        alt="sleeping-portfolio-icon"
        width={'100%'}
        height={358}
        className="img sleeping"
      />
      <p className="text on-it">On it</p>
      <img
        src="/assets/portfolio/king-portfolio-icon.svg"
        alt="king-portfolio-icon"
        width={'100%'}
        height={516}
        className="img"
      />
      <div className="row-img-container">
        <img
          src="/assets/portfolio/construction-worker-portfolio-icon.svg"
          alt="construction-worker-portfolio-icon"
          width={484}
          height={516}
          className="img"
        />
        <img
          src="/assets/portfolio/meditation-portfolio-icon.svg"
          alt="meditation-portfolio-icon"
          width={484}
          height={516}
          className="img"
        />
        <img
          src="/assets/portfolio/painting-portfolio-icon.svg"
          alt="painting-portfolio-icon"
          width={484}
          height={516}
          className="img"
        />
      </div>
      <div className="row-img-container">
        <img
          src="/assets/portfolio/stocks-portfolio-icon.svg"
          alt="stocks-portfolio-icon"
          width={484}
          height={516}
          className="img"
        />
        <div className="col-img-container">
          <img
            src="/assets/portfolio/workout-portfolio-icon.svg"
            alt="stocks-portfolio-icon"
            width={484}
            height={516}
            className="img"
          />
          <img
            src="/assets/portfolio/excited-portfolio-icon.svg"
            alt="stocks-portfolio-icon"
            width={484}
            height={516}
            className="img"
          />
        </div>
        <img
          src="/assets/portfolio/confused-portfolio-icon.svg"
          alt="stocks-portfolio-icon"
          width={484}
          height={516}
          className="img"
        />
      </div>
      <p className="text bottom-text trust-us">Trust us</p>
      <p className="text bottom-text">We are working hard</p>
    </div>
  )
}

export default Portfolio

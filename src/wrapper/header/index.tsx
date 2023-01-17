import { Link, useLocation } from 'react-router-dom'
import { Sprite } from '../../components'
import { NAV_LINKS } from '../../utils'
import './header.scss'

const Header = () => {
  const location = useLocation()

  return (
    <div className="header">
      <div className="logo-area">
        <Sprite id="cruize-header-icon" width={128} height={46} />
        <div className="links">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={`${index} - ${link.link}`}
              to={`/${link.link}`}
              className={`link ${
                location.pathname.includes(link.link) ? ' active' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Header

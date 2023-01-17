import { useLocation } from 'react-router-dom'
import AppRoutes from '../routes'
import Footer from './footer'
import Header from './header'
import './wrapper.scss'

const Wrapper = () => {
  const location = useLocation()

  return (
    <div
      className="wrapper"
      style={{ background: `var(--${location.pathname.slice(1)}-background)`, transition: 'background-color 1s ease-in' }}
    >
      <Header />
      <div className="fake-div"></div>
      <div className="content">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  )
}

export default Wrapper

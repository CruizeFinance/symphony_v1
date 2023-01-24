import { useContext } from 'react'
import { AppContext } from '../context'
import AppRoutes from '../routes'
import Footer from './footer'
import Header from './header'
import './wrapper.scss'

const Wrapper = () => {
  const [state] = useContext(AppContext)

  return (
    <div
      className="wrapper"
      style={{
        background: `var(--${state.bgColor}-background)`,
      }}
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

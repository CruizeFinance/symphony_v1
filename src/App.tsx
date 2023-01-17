import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom'
import './style/app.scss'
import Wrapper from './wrapper'

const App = () => {
  return <div className="app">
    <BrowserRouter>
      <Switch>
        <Route path='/*' element={<Wrapper />} />
      </Switch>
    </BrowserRouter>
  </div>
}

export default App

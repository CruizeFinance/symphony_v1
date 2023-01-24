import { Routes as Switch, Route, Navigate } from 'react-router-dom'
import { PageNotFound, Portfolio, Principal, Vault } from '../pages'

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/" element={<Navigate to={'/vault'} replace={true} />} />
      <Route path="/vault" element={<Vault />}></Route>
      <Route path="/vault/principal" element={<Principal />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path='*' element={<PageNotFound />} />
    </Switch>
  )
}

export default AppRoutes

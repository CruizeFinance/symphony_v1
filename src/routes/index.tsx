import { Routes as Switch, Route, Navigate } from 'react-router-dom'
import { PageNotFound, Portfolio, Principal, Vault } from '../pages'

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/" element={<Navigate to={'/vaults'} replace={true} />} />
      <Route path="/vaults" element={<Vault />}></Route>
      <Route path="/vaults/principal" element={<Principal />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path='*' element={<PageNotFound />} />
    </Switch>
  )
}

export default AppRoutes

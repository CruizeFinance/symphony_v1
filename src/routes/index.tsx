import { Routes as Switch, Route, Navigate } from 'react-router-dom'
import { PageNotFound, Portfolio, TwinPeaks, Vault, Manage } from '../pages'

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/" element={<Navigate to={'/vaults'} replace={true} />} />
      <Route path="/vaults" element={<Vault />}></Route>
      <Route path="/vaults/twinpeaks" element={<TwinPeaks />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/manage" element={<Manage />} />
      <Route path='*' element={<PageNotFound />} />
    </Switch>
  )
}

export default AppRoutes

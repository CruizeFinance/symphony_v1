import { Routes as Switch, Route, Navigate } from 'react-router-dom'
import { PageNotFound, Portfolio, TwinPeaks, Vault } from '../pages'

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/" element={<Navigate to={'/vaults'} replace={true} />} />
      <Route path="/vaults" element={<Vault />}></Route>
      <Route path="/vaults/twinpeaks" element={<TwinPeaks />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/vaults/twinpeaks/eth" element={<TwinPeaks />} />
      <Route path="/vaults/twinpeaks/weth" element={<TwinPeaks />} />
      <Route path="/vaults/twinpeaks/wbtc" element={<TwinPeaks />} />
      <Route path="/vaults/twinpeaks/usdc" element={<TwinPeaks />} />
      <Route path='*' element={<PageNotFound />} />
    </Switch>
  )
}

export default AppRoutes

import { Routes as Switch, Route, Navigate } from 'react-router-dom'
import { Vault } from '../pages'

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/" element={<Navigate to={'/vault'} replace={true} />} />
      <Route path="/vault" element={<Vault />} />
    </Switch>
  )
}

export default AppRoutes

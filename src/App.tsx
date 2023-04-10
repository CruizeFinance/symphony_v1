import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom'
import { AppContextProvider } from './context'
import './style/app.scss'
import Wrapper from './wrapper'
import {
  Web3OnboardProvider,
  init,
} from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import frontierModule from '@web3-onboard/frontier'
import walletConnectModule from '@web3-onboard/walletconnect'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { SUPPORTED_CHAINS } from './utils'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSENGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
if (process.env.REACT_APP_ENV && process.env.REACT_APP_ENV !== 'dev') {
  const app = initializeApp(firebaseConfig)
  getAnalytics(app)
}

const chains = SUPPORTED_CHAINS
const wallets = [injectedModule(), frontierModule(), walletConnectModule()]
const web3Onboard = init({
  wallets,
  chains,
  appMetadata: {
    name: 'Cruize Finance',
    description: 'Cruize Finance dApp',
  },
})

const App = () => {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <AppContextProvider>
        <div className="app">
          <BrowserRouter>
            <Switch>
              <Route path="/*" element={<Wrapper />} />
            </Switch>
          </BrowserRouter>
        </div>
      </AppContextProvider>
    </Web3OnboardProvider>
  )
}

export default App

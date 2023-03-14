import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom'
import { AppContextProvider } from './context'
import './style/app.scss'
import Wrapper from './wrapper'
import { configureChains } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { infuraProvider } from '@wagmi/core/providers/infura'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { WagmiConfig, createClient } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { SUPPORTED_CHAINS } from './utils'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

const App = () => {
  const {
    chains,
    provider,
    webSocketProvider,
  } = configureChains(SUPPORTED_CHAINS, [
    infuraProvider({ apiKey: process.env.REACT_APP_INFURA_ID!, priority: 0 }),
    publicProvider({ priority: 1 }),
  ])

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({
        chains,
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: false,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="soft">
        <AppContextProvider>
          <div className="app">
            <BrowserRouter>
              <Switch>
                <Route path="/*" element={<Wrapper />} />
              </Switch>
            </BrowserRouter>
          </div>
        </AppContextProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default App

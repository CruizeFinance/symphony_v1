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
          qrcode: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme='soft'>
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

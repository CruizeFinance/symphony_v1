import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom'
import { AppContextProvider } from './context'
import './style/app.scss'
import Wrapper from './wrapper'
import { configureChains, goerli } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { infuraProvider } from '@wagmi/core/providers/infura'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { WagmiConfig, createClient } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { SUPPORTED_CHAINS } from './utils'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const App = () => {
  const {
    chains,
    provider,
    webSocketProvider,
  } = configureChains([goerli], [
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

  const graphClient = new ApolloClient({
    uri:
      'https://api.studio.thegraph.com/query/41560/cruize-testing-vaults/v0.0.7',
    cache: new InMemoryCache(),
  })

  return (
    <ApolloProvider client={graphClient}>
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
    </ApolloProvider>
  )
}

export default App

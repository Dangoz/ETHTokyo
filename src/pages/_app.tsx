import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygonMumbai, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { LensConfig, development, LensProvider } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { handleError } from '@/common/notification'
import { SearchContextProvider } from '@/store/searchContext'

const { provider, webSocketProvider } = configureChains([polygon, polygonMumbai], [publicProvider()])

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development,
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SearchContextProvider>
      <WagmiConfig client={client}>
        <LensProvider config={lensConfig} onError={handleError}>
          <Component {...pageProps} />
        </LensProvider>
      </WagmiConfig>
    </SearchContextProvider>
  )
}

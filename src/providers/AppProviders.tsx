import type { FC, PropsWithChildren } from 'react'
import { PosthogProvider } from './PosthogProvider/PosthogProvider'
import { SDKProvider } from './SDKProvider/SDKProvider'
import { StoreProvider } from '../store/StoreProvider'
import { InitializeLoadables } from '../hooks/Loadables/useInitialize'
import { QueryClientProvider } from '@tanstack/react-query'
import { QueryConfiguration } from '../configuration/query'
import { ThemeProvider } from './ThemeProvider/ThemeProvider'
import { Web3Provider } from './Web3Provider/Web3Provider'

export const AppProviders: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<PosthogProvider>
			<QueryClientProvider client={QueryConfiguration}>
				<StoreProvider>
					<Web3Provider>
						<SDKProvider>
							<ThemeProvider />
							<InitializeLoadables />
							{children}
						</SDKProvider>
					</Web3Provider>
				</StoreProvider>
			</QueryClientProvider>
		</PosthogProvider>
	)
}

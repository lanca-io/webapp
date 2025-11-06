import type { FC, PropsWithChildren } from 'react'
import { PosthogProvider } from './PosthogProvider/PosthogProvider'
import { I18NProvider } from './I18NProvider/I18NProvider'
import { SDKProvider } from './SDKProvider/SDKProvider'
import { StoreProvider } from '../store/StoreProvider'
import { InitializeLoadables } from '../hooks/Loadables/useInitialize'
import { QueryClientProvider } from '@tanstack/react-query'
import { QueryConfiguration } from '../configuration/query'
import { Web3Provider } from './Web3Provider/Web3Provider'

export const AppProviders: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<PosthogProvider>
			<QueryClientProvider client={QueryConfiguration}>
				<StoreProvider>
					<I18NProvider>
						<Web3Provider>
							<SDKProvider>
								<InitializeLoadables />
								{children}
							</SDKProvider>
						</Web3Provider>
					</I18NProvider>
				</StoreProvider>
			</QueryClientProvider>
		</PosthogProvider>
	)
}

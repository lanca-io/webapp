import type { FC, PropsWithChildren } from 'react'
import { WagmiProvider } from './WagmiProvider/WagmiProvider'
import { PosthogProvider } from './PosthogProvider/PosthogProvider'
import { I18NProvider } from './I18NProvider/I18NProvider'
import { SDKProvider } from './SDKProvider/SDKProvider'
import { StoreProvider } from '../store/StoreProvider'
import { InitializeLoadables } from '../hooks/Loadables/useInitialize'

export const AppProviders: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<PosthogProvider>
			<I18NProvider>
				<WagmiProvider>
					<SDKProvider>
						<StoreProvider>
							<InitializeLoadables />
							{children}
						</StoreProvider>
					</SDKProvider>
				</WagmiProvider>
			</I18NProvider>
		</PosthogProvider>
	)
}

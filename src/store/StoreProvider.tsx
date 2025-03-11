import type { FC, ReactNode } from 'react'
import { SplitSubvariantStoreProvider } from './config/SplitSubvariantStore'
import { SettingsStoreProvider } from './settings/SettingsStore'
import { FormStoreProvider } from './form/FormStore'
import { RoutesStoreProvider } from './route/RouteStore'
import { ChainStoreProvider } from './chains/ChainsStore'
import { TokensStoreProvider } from './tokens/TokensStore'

interface StoreProviderProps {
	children: ReactNode
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
	return (
		<SplitSubvariantStoreProvider>
			<SettingsStoreProvider>
				<ChainStoreProvider>
					<TokensStoreProvider>
						<FormStoreProvider>
							<RoutesStoreProvider>{children}</RoutesStoreProvider>
						</FormStoreProvider>
					</TokensStoreProvider>
				</ChainStoreProvider>
			</SettingsStoreProvider>
		</SplitSubvariantStoreProvider>
	)
}

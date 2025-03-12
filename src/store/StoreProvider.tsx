import type { FC, ReactNode } from 'react'
import { SplitSubvariantStoreProvider } from './config/SplitSubvariantStore'
import { SettingsStoreProvider } from './settings/SettingsStore'
import { FormStoreProvider } from './form/FormStore'
import { RoutesStoreProvider } from './route/RouteStore'
import { ChainsStoreProvider } from './chains/ChainsStore'
import { TokensStoreProvider } from './tokens/TokensStore'

interface StoreProviderProps {
	children: ReactNode
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
	return (
		<SplitSubvariantStoreProvider>
			<SettingsStoreProvider>
				<ChainsStoreProvider>
					<TokensStoreProvider>
						<FormStoreProvider>
							<RoutesStoreProvider>{children}</RoutesStoreProvider>
						</FormStoreProvider>
					</TokensStoreProvider>
				</ChainsStoreProvider>
			</SettingsStoreProvider>
		</SplitSubvariantStoreProvider>
	)
}

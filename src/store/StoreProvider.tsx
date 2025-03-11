import type { FC, ReactNode } from 'react'
import { SplitSubvariantStoreProvider } from './config/SplitSubvariantStore'
import { SettingsStoreProvider } from './settings/SettingsStore'
import { FormStoreProvider } from './form/FormStore'
import { RoutesStoreProvider } from './route/RouteStore'

interface StoreProviderProps {
	children: ReactNode
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
	return (
		<SplitSubvariantStoreProvider>
			<SettingsStoreProvider>
				<FormStoreProvider>
					<RoutesStoreProvider>{children}</RoutesStoreProvider>
				</FormStoreProvider>
			</SettingsStoreProvider>
		</SplitSubvariantStoreProvider>
	)
}

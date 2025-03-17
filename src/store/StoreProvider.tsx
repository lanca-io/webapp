import type { FC, PropsWithChildren } from 'react'
import { SplitSubvariantStoreProvider } from './config/SplitSubvariantStore'
import { SettingsStoreProvider } from './settings/SettingsStore'
import { RoutesStoreProvider } from './route/RouteStore'
import { ChainsStoreProvider } from './chains/ChainsStore'
import { TokensStoreProvider } from './tokens/TokensStore'
import { FormStoreProvider } from './form/FormStore'
import { BalancesStoreProvider } from './balances/BalancesStore'

export const StoreProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<SplitSubvariantStoreProvider>
			<SettingsStoreProvider>
				<ChainsStoreProvider>
					<TokensStoreProvider>
						<BalancesStoreProvider>
							<FormStoreProvider>
								<RoutesStoreProvider>{children}</RoutesStoreProvider>
							</FormStoreProvider>
						</BalancesStoreProvider>
					</TokensStoreProvider>
				</ChainsStoreProvider>
			</SettingsStoreProvider>
		</SplitSubvariantStoreProvider>
	)
}

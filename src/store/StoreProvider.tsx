import type { FC, PropsWithChildren } from 'react'
import { SubvariantStoreProvider } from './subvariant/SubvariantStore'
import { SettingsStoreProvider } from './settings/SettingsStore'
import { RoutesStoreProvider } from './route/RouteStore'
import { ChainsStoreProvider } from './chains/ChainsStore'
import { TokensStoreProvider } from './tokens/TokensStore'
import { FormStoreProvider } from './form/FormStore'
import { BalancesStoreProvider } from './balances/BalancesStore'
import { ModalsStoreProvider } from './modals/ModalsStore'
import { TxExecutionStoreProvider } from './tx-execution/TxExecutionStore'

export const StoreProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<SubvariantStoreProvider>
			<SettingsStoreProvider>
				<ChainsStoreProvider>
					<TokensStoreProvider>
						<BalancesStoreProvider>
							<FormStoreProvider>
								<ModalsStoreProvider>
									<RoutesStoreProvider>
										<TxExecutionStoreProvider>{children}</TxExecutionStoreProvider>
									</RoutesStoreProvider>
								</ModalsStoreProvider>
							</FormStoreProvider>
						</BalancesStoreProvider>
					</TokensStoreProvider>
				</ChainsStoreProvider>
			</SettingsStoreProvider>
		</SubvariantStoreProvider>
	)
}

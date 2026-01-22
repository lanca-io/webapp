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
import { PoolsDataStoreProvider } from './pools-data/PoolsDataStore'
import { PoolsUserBalancesStoreProvider } from './pools-user-balances/PoolsUserBalancesStore'

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
										<TxExecutionStoreProvider>
											<PoolsDataStoreProvider>
												<PoolsUserBalancesStoreProvider>
													{children}
												</PoolsUserBalancesStoreProvider>
											</PoolsDataStoreProvider>
										</TxExecutionStoreProvider>
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

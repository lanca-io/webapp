import type { PropsWithChildren } from 'react'
import type { PoolsUserBalanceStore } from './types'
import { CreatePoolsUserBalanceStore } from './CreatePoolsUserBalancesStore'
import { PoolsUserBalancesContext } from './PoolsUserBalancesContext'
import { useRef } from 'react'

export function PoolsUserBalancesStoreProvider({
	children,
}: PropsWithChildren) {
	const storeRef = useRef<PoolsUserBalanceStore>()

	if (!storeRef.current) {
		storeRef.current = CreatePoolsUserBalanceStore()
	}

	return (
		<PoolsUserBalancesContext.Provider value={storeRef.current}>
			{children}
		</PoolsUserBalancesContext.Provider>
	)
}

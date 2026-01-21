import type { PropsWithChildren } from 'react'
import type { PoolsExecutionStore } from './types'
import { CreatePoolsExecutionStore } from './CreatePoolsExecutionStore'
import { PoolsExecutionContext } from './PoolsExecutionContext'
import { useRef } from 'react'

export function PoolsExecutionStoreProvider({ children }: PropsWithChildren) {
	const storeRef = useRef<PoolsExecutionStore>()

	if (!storeRef.current) {
		storeRef.current = CreatePoolsExecutionStore()
	}

	return (
		<PoolsExecutionContext.Provider value={storeRef.current}>
			{children}
		</PoolsExecutionContext.Provider>
	)
}

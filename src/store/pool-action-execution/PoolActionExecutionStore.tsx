import type { PropsWithChildren } from 'react'
import type { PoolActionExecutionStore } from './types'
import { CreatePoolActionExecutionStore } from './CreatePoolActionExecutionStore'
import { PoolActionExecutionContext } from './PoolActionExecutionContext'
import { useRef } from 'react'

export function PoolActionExecutionStoreProvider({
	children,
}: PropsWithChildren) {
	const storeRef = useRef<PoolActionExecutionStore>()

	if (!storeRef.current) {
		storeRef.current = CreatePoolActionExecutionStore()
	}

	return (
		<PoolActionExecutionContext.Provider value={storeRef.current}>
			{children}
		</PoolActionExecutionContext.Provider>
	)
}

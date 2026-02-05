import type { PropsWithChildren } from 'react'
import type { PoolsPositionsStore } from './types'
import { CreatePoolsPositionsStore } from './CreatePoolsPositionsStore'
import { PoolsPositionsContext } from './PoolsPositionsContext'
import { useRef } from 'react'

export function PoolsPositionsStoreProvider({ children }: PropsWithChildren) {
	const storeRef = useRef<PoolsPositionsStore>()

	if (!storeRef.current) {
		storeRef.current = CreatePoolsPositionsStore()
	}

	return (
		<PoolsPositionsContext.Provider value={storeRef.current}>
			{children}
		</PoolsPositionsContext.Provider>
	)
}

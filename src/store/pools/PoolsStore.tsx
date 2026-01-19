import type { PropsWithChildren } from 'react'
import type { PoolsStore } from './types'
import { CreatePoolsStore } from './CreatePoolsStore'
import { useRef } from 'react'
import { PoolsContext } from './PoolsContext'

export function PoolsStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<PoolsStore | null>(null)
	if (!storeRef.current) {
		storeRef.current = CreatePoolsStore()
	}

	return (
		<PoolsContext.Provider value={storeRef.current}>
			{children}
		</PoolsContext.Provider>
	)
}

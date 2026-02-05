import type { PropsWithChildren } from 'react'
import type { PoolsStore } from './types'
import { CreatePoolsDataStore } from './CreatePoolsDataStore'
import { useRef } from 'react'
import { PoolsDataContext } from './PoolsDataContext'

export function PoolsDataStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<PoolsStore | null>(null)
	if (!storeRef.current) {
		storeRef.current = CreatePoolsDataStore()
	}

	return (
		<PoolsDataContext.Provider value={storeRef.current}>
			{children}
		</PoolsDataContext.Provider>
	)
}

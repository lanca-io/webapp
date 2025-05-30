import type { PropsWithChildren } from 'react'
import type { SubvariantStore } from './types'
import { useRef } from 'react'
import { SubvariantContext } from './SubvariantContext'
import { CreateSubvariantStore } from './CreateSubvariantStore'

export function SubvariantStoreProvider({ children }: PropsWithChildren) {
	const storeRef = useRef<SubvariantStore>()

	if (!storeRef.current) {
		storeRef.current = CreateSubvariantStore()
	}

	return <SubvariantContext.Provider value={storeRef.current}>{children}</SubvariantContext.Provider>
}

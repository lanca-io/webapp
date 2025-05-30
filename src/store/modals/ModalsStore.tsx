import type { PropsWithChildren } from 'react'
import type { ModalStore } from './types'
import { useRef } from 'react'
import { CreateModalsStore } from './CreateModalsStore'
import { ModalsContext } from './ModalsContext'

export function ModalsStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<ModalStore | null>(null)
	if (!storeRef.current) {
		storeRef.current = CreateModalsStore()
	}
	return <ModalsContext.Provider value={storeRef.current}>{children}</ModalsContext.Provider>
}

import type { PropsWithChildren } from 'react'
import type { SettingsStore } from './types'
import { useRef } from 'react'
import { SettingsContext } from './SettingsContext'
import { CreateSettingsStore } from './CreateSettingsStore'

export function SettingsStoreProvider({ children }: PropsWithChildren) {
	const storeRef = useRef<SettingsStore>()

	if (!storeRef.current) {
		storeRef.current = CreateSettingsStore()
	}

	return <SettingsContext.Provider value={storeRef.current}>{children}</SettingsContext.Provider>
}

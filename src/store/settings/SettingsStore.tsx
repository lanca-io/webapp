import type { PropsWithChildren } from 'react'
import type { StateCreator } from 'zustand'
import type { SettingsProps, SettingsActions } from './types'
import { useContext, useRef } from 'react'
import { persist } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import { SettingsStoreContext, type SettingsStore } from './SettingsStoreContext'

export function SettingsStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<SettingsStore>()
	if (!storeRef.current) {
		storeRef.current = createSettingsStore({})
	}
	return <SettingsStoreContext.Provider value={storeRef.current}>{children}</SettingsStoreContext.Provider>
}

export function useSettingsStore<T>(
	selector: (state: SettingsActions) => T,
	equalityFn?: (left: T, right: T) => boolean,
): T {
	const useStore = useContext(SettingsStoreContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${SettingsStoreProvider.name}>.`)
	}
	return useStore(selector, equalityFn)
}

export function useSettingsStoreContext() {
	const useStore = useContext(SettingsStoreContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${SettingsStoreProvider.name}>.`)
	}
	return useStore
}

export const defaultSlippage = '0.5'

export const defaultSettings: SettingsProps = {
	slippage: defaultSlippage,
}

export const createSettingsStore = ({ namePrefix }: { namePrefix?: string }) =>
	createWithEqualityFn<SettingsActions>(
		persist(
			set => ({
				...defaultSettings,
				setValue: (key, value) => {
					if (key in defaultSettings) {
						set(() => ({
							[key]: value,
						}))
					} else {
						console.error(`Invalid key: ${key}`)
					}
				},
				setValues: (values: Partial<SettingsProps>) => {
					set(state => {
						const updatedState: SettingsProps = { ...state }
						Object.entries(values).forEach(([key, value]) => {
							if (Object.prototype.hasOwnProperty.call(state, key)) {
								updatedState[key as keyof SettingsProps] = value as SettingsProps[keyof SettingsProps]
							} else {
								console.error(`Invalid key: ${key}`)
							}
						})
						return updatedState
					})
				},
			}),
			{
				name: `${namePrefix || 'lanca'}-settings`,
				version: 1,
				partialize: state => ({ slippage: state.slippage }),
			},
		) as StateCreator<SettingsActions, [], [], SettingsActions>,
		Object.is,
	)

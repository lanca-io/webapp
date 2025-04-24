import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export type SettingsStateSlice = {
	slippage: string
}

export type SettingsActions = {
	setSlippage: (slippage: string) => void
	resetSettings: () => void
}

export type SettingsState = SettingsStateSlice & SettingsActions
export type SettingsStore = UseBoundStoreWithEqualityFn<StoreApi<SettingsState>>

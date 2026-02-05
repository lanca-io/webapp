import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export type SettingsStateSlice = {
	slippage: string
	theme: Theme
}

export type SettingsActions = {
	setSlippage: (slippage: string) => void
	setTheme: (theme: Theme) => void
	resetSettings: () => void
}

export type SettingsState = SettingsStateSlice & SettingsActions
export type SettingsStore = UseBoundStoreWithEqualityFn<StoreApi<SettingsState>>

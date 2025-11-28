import type { SettingsState } from './types'
import type { StateCreator } from 'zustand'
import { Theme } from './types'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

export const defaultSlippage = '0.005'
export const defaultTheme = Theme.LIGHT

export const CreateSettingsStore = () =>
	createWithEqualityFn<SettingsState>(
		persist(
			set => ({
				slippage: defaultSlippage,
				theme: defaultTheme,
				setSlippage: (slippage: string) => set({ slippage }),
				setTheme: (theme: Theme.LIGHT | Theme.DARK) => {
					set({ theme })
					document.documentElement.setAttribute('data-theme', theme)
					document.documentElement.style.colorScheme = theme
				},
				resetSettings: () =>
					set({
						slippage: defaultSlippage,
						theme: defaultTheme,
					}),
			}),
			{
				name: 'concero-scan-settings',
				version: 1,
				storage: createJSONStorage(() => localStorage),
				partialize: state => ({
					slippage: state.slippage,
					theme: state.theme,
				}),
			},
		) as StateCreator<SettingsState, [], [], SettingsState>,
		Object.is,
	)

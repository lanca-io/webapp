import type { SettingsState } from './types'
import type { StateCreator } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

export const defaultSlippage = '0.005'

export const CreateSettingsStore = () =>
	createWithEqualityFn<SettingsState>(
		persist(
			set => ({
				slippage: defaultSlippage,
				setSlippage: (slippage: string) => set({ slippage }),
				resetSettings: () => set({ slippage: defaultSlippage }),
			}),
			{
				name: 'lanca-settings',
				version: 1,
				storage: createJSONStorage(() => localStorage),
				partialize: state => ({
					slippage: state.slippage,
				}),
			},
		) as StateCreator<SettingsState, [], [], SettingsState>,
		Object.is,
	)

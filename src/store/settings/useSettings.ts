import { useContext } from 'react'
import { SettingsContext } from './SettingsContext'

export const useSettingsStore = () => {
	const useStore = useContext(SettingsContext)
	if (!useStore) {
		throw new Error(
			`You forgot to wrap your component in <SettingsStoreProvider>.`,
		)
	}

	const slippage = useStore(state => state.slippage)
	const setSlippage = useStore(state => state.setSlippage)
	const theme = useStore(state => state.theme)
	const setTheme = useStore(state => state.setTheme)
	const resetSettings = useStore(state => state.resetSettings)

	return {
		slippage,
		setSlippage,
		theme,
		setTheme,
		resetSettings,
	}
}

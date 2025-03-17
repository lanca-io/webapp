import { useSettingsStore } from './SettingsStore'

export const useSettings = () => {
	const settings = useSettingsStore(state => state)
	const setValue = useSettingsStore(state => state.setValue)
	const setValues = useSettingsStore(state => state.setValues)

	return {
		settings,
		setValue,
		setValues,
	}
}

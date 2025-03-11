import type { DefaultValues } from '../store/form/types'
import type { SettingsProps } from '../store/settings/types'

export enum Event {
	FormFieldChanged = 'formFieldChanged',
	SettingUpdated = 'settingUpdated',
}

export interface Events {
	formFieldChanged: FormFieldChanged
	settingUpdated: SettingUpdated
}

export type FormFieldChanged = {
	[K in keyof DefaultValues]: {
		fieldName: K
		newValue: DefaultValues[K]
		oldValue: DefaultValues[K]
	}
}[keyof DefaultValues]

export interface SettingUpdated<K extends keyof SettingsProps = keyof SettingsProps> {
	setting: K
	newValue: SettingsProps[K]
	oldValue: SettingsProps[K]
	newSettings: SettingsProps
	oldSettings: SettingsProps
}

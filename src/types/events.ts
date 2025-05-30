import type { DefaultValues } from '../store/form/types'
import type { SettingsProps } from '../store/settings/types'

export enum Event {
	FormFieldChanged = 'formFieldChanged',
	SettingUpdated = 'settingUpdated',
	ChainUpdated = 'chainUpdated',
}

export type Events = {
	formFieldChanged: FormFieldChanged
	settingUpdated: SettingUpdated
	chainUpdated: ChainChangedEvent
}

export interface ChainChangedEvent {
	oldChainId: string | null
	newChainId: string
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

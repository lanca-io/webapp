export type ValueSetter<S> = <K extends keyof S>(key: K, value: S[Extract<K, string>]) => void
export type ValuesSetter<S> = <K extends keyof S>(values: Record<K, S[Extract<K, string>]>) => void
export type ValueGetter<S> = <K extends keyof S>(key: K) => S[K]

export interface SettingsProps {
	slippage?: string
}

export type SettingsActions = SettingsProps & {
	setValue: ValueSetter<SettingsProps>
	setValues: ValuesSetter<SettingsProps>
}

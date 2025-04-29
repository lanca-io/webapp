import type { ExtendedToken } from '../../../store/tokens/types'

export type AmountPanelProps = {
	token: ExtendedToken | null
}

export type BalanceDisplayProps = {
	balance: number
	symbol: string
}

export type NumericalModeResult = () => void
export type TextModeResult = () => void
export type PercentageModeResult = () => void

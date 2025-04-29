import type { ExtendedToken } from '../store/tokens/types'
import { useState, useEffect, useCallback } from 'react'
import { useTextInputMode } from './useTextInputMode'
import { useNumberInputMode } from './useNumberInputMode'
import { usePercentInputMode } from './usePercentInputMode'
import { useDollarInputMode } from './useDollarInputMode'

export enum Mode {
	Text = 'text',
	Number = 'number',
	Percent = 'percent',
	Dollar = 'dollar',
	None = 'none',
}

export const useInputMode = (value: string, token: ExtendedToken | null) => {
	const [mode, setMode] = useState<Mode>(Mode.None)

	const textHandler = useTextInputMode(value, token)
	const numberHandler = useNumberInputMode(value, token)
	const percentHandler = usePercentInputMode(value, token)
	const dollarHandler = useDollarInputMode(value, token)

	const processInput = useCallback(() => {
		if (mode === Mode.None) return

		const handler = {
			[Mode.Text]: textHandler,
			[Mode.Number]: numberHandler,
			[Mode.Percent]: percentHandler,
			[Mode.Dollar]: dollarHandler,
		}[mode]

		handler()
	}, [mode, textHandler, numberHandler, percentHandler, dollarHandler])

	useEffect(() => {
		processInput()
	}, [processInput])

	const determineMode = useCallback((input: string): Mode => {
		if (!input) return Mode.None
		if (/^[a-zA-Z]+$/.test(input)) return Mode.Text
		if (input.includes('%')) return Mode.Percent
		if (input.includes('$')) return Mode.Dollar
		return Mode.Number
	}, [])

	return {
		mode,
		setMode,
		determineMode,
		processInput,
	}
}

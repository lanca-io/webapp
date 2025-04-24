import type { ExtendedToken } from '../../../store/tokens/types'
import { Mode } from './types'
import { useState, useEffect, useCallback } from 'react'
import { useTextMode } from './useTextMode'
import { usePercentMode } from './usePercentMode'
import { useNumberMode } from './useNumberMode'
import { useDollarMode } from './useDollarMode'

export const useMode = (value: string, tokenData: ExtendedToken | null) => {
	const [mode, setMode] = useState<Mode>(Mode.None)

	const balance = tokenData?.balance ?? '0'
	const decimals = tokenData?.decimals ?? 18

	const textHandler = useTextMode(value, balance)
	const numberHandler = useNumberMode(value, decimals, balance)
	const percentHandler = usePercentMode(value, balance)
	const dollarHandler = useDollarMode(value, tokenData?.priceUsd ?? 0, decimals)

	useEffect(() => {
		if (mode === Mode.None) return
		const handler = {
			[Mode.Text]: textHandler,
			[Mode.Number]: numberHandler,
			[Mode.Percent]: percentHandler,
			[Mode.Dollar]: dollarHandler,
		}[mode]

		handler()
	}, [mode, textHandler, numberHandler, percentHandler])

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
	}
}

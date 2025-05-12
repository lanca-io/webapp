import { useState, useEffect, useCallback } from 'react'
import { defaultSlippage } from '../store/settings/CreateSettingsStore'
import { normalizeSlippageInput } from '../utils/new/input'
import { useDebounce } from './useDebounce'

export function useHandleSlippageInput(
	slippage: string,
	setSlippage: (value: string) => void,
	maxSlippage: number = 100,
) {
	const [isCustom, setIsCustom] = useState(slippage !== defaultSlippage)
	const [input, setInput] = useState(slippage !== defaultSlippage ? String(slippage) + '%' : '')
	const debouncedInput = useDebounce(input, 700)

	useEffect(() => {
		if (!isCustom || !debouncedInput) return

		const numeric = debouncedInput.replace('%', '')
		if (!numeric) return

		if (/^\d{0,3}(\.\d{0,3})?$/.test(numeric)) {
			let num = parseFloat(numeric)
			if (!isNaN(num) && num >= 0.1 && num <= maxSlippage) {
				setSlippage(String(num))
			} else if (num > maxSlippage) {
				setInput(String(maxSlippage) + '%')
				setSlippage(String(maxSlippage))
			}
		}
	}, [debouncedInput, isCustom, setSlippage, maxSlippage])

	useEffect(() => {
		if (slippage === defaultSlippage) {
			setIsCustom(false)
			setInput('')
		} else {
			setIsCustom(true)
			setInput(String(slippage) + '%')
		}
	}, [slippage])

	const toggleMode = useCallback(() => {
		if (!isCustom) {
			setIsCustom(true)
			setInput('')
		} else {
			setIsCustom(false)
			setSlippage(defaultSlippage)
			setInput('')
		}
	}, [isCustom, setSlippage])

	const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const rawInput = e.target.value
		const sanitized = normalizeSlippageInput(rawInput)
		setInput(sanitized)
	}, [])

	const onBlur = useCallback(() => {
		const numeric = input.replace('%', '')
		const num = parseFloat(numeric)
		if (!input || isNaN(num) || num < 0.1 || num > maxSlippage) {
			setSlippage(defaultSlippage)
			setIsCustom(false)
			setInput('')
		} else {
			setInput(String(num) + '%')
		}
	}, [input, setSlippage, maxSlippage])

	const displayValue = isCustom ? input : `${defaultSlippage}%`

	return {
		isCustom,
		setIsCustom,
		input,
		setInput,
		displayValue,
		toggleMode,
		onChange,
		onBlur,
	}
}

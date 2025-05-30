import { useCallback, useEffect, useMemo } from 'react'
import { defaultSlippage } from '../store/settings/CreateSettingsStore'
import { normalizeSlippageInput } from '../utils/new/input'
import { useDebounce } from './useDebounce'
import { useSettingsStore } from '../store/settings/useSettings'
import { useFormStore } from '../store/form/useFormStore'
import { SlippageMode } from '../store/form/types'

const MIN = 0.0001
const MAX = 0.99
const DEBOUNCE_MS = 1000
const VALID_INPUT_REGEX = /^(?:\d{1,2}(?:\.\d{0,2})?|\.\d{1,2})?$/
const MAX_PERCENT = 99

export const useSlippageInput = () => {
	const { slippage, setSlippage } = useSettingsStore()
	const { slippageInput, slippageInputMode, setSlippageInput, setSlippageMode, setSlippageInputFocused } =
		useFormStore()

	const isAutoMode = useMemo(() => slippageInputMode === SlippageMode.Auto, [slippageInputMode])
	const defaultDisplay = useMemo(() => `${Number(defaultSlippage) * 100}%`, [])
	const debouncedInput = useDebounce(slippageInput, DEBOUNCE_MS)

	useEffect(() => {
		if (isAutoMode) {
			const shouldClear = slippage === defaultSlippage
			setSlippageInput(shouldClear ? '' : `${Number(slippage) * 100}`)
		}
	}, [slippage, isAutoMode, setSlippageInput])

	useEffect(() => {
		if (!isAutoMode && debouncedInput) {
			const rawValue = debouncedInput.replace('%', '')

			if (VALID_INPUT_REGEX.test(rawValue)) {
				const percentValue = Math.min(Number(rawValue), MAX_PERCENT)
				const decimalValue = percentValue / 100
				const clampedValue = Math.min(Math.max(decimalValue, MIN), MAX)

				setSlippage(clampedValue.toFixed(4))
				if (percentValue === MAX_PERCENT) setSlippageInput('99%')
			}
		}
	}, [debouncedInput, isAutoMode, setSlippage, setSlippageInput])

	useEffect(() => {
		if (!isAutoMode && slippageInput && debouncedInput === slippageInput) {
			if (!slippageInput.endsWith('%')) {
				setSlippageInput(`${slippageInput}%`)
			}
		}
	}, [debouncedInput, isAutoMode, slippageInput, setSlippageInput])

	useEffect(() => {
		if (slippage !== defaultSlippage && isAutoMode) {
			setSlippageMode(SlippageMode.Custom)
			setSlippageInput(`${Number(slippage) * 100}%`)
		}
	}, [slippage, isAutoMode, setSlippageMode, setSlippageInput])

	const toggleMode = useCallback(() => {
		if (!isAutoMode) {
			setSlippageMode(SlippageMode.Auto)
			setSlippage(defaultSlippage)
			setSlippageInput('')
		}
	}, [isAutoMode, setSlippageMode, setSlippage, setSlippageInput])

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSlippageMode(SlippageMode.Custom)
			const cleanValue = normalizeSlippageInput(e.target.value)

			if (VALID_INPUT_REGEX.test(cleanValue.replace('%', ''))) {
				const numericValue = Math.min(Number(cleanValue.replace('%', '')), MAX_PERCENT)
				setSlippageInput(numericValue === MAX_PERCENT ? '99%' : cleanValue)
			}
		},
		[setSlippageMode, setSlippageInput],
	)

	const handleBlur = useCallback(() => {
		if (!slippageInput) {
			setSlippage(defaultSlippage)
			setSlippageMode(SlippageMode.Auto)
		} else {
			const decimalValue = Number(slippageInput.replace('%', '')) / 100
			if (decimalValue < MIN || decimalValue > MAX) {
				setSlippage(defaultSlippage)
				setSlippageMode(SlippageMode.Auto)
				setSlippageInput('')
			} else if (!slippageInput.endsWith('%')) {
				setSlippageInput(`${slippageInput}%`)
			}
		}
		setSlippageInputFocused(false)
	}, [slippageInput, setSlippage, setSlippageMode, setSlippageInput, setSlippageInputFocused])

	const handleFocus = useCallback(() => {
		setSlippageMode(SlippageMode.Custom)
		setSlippageInputFocused(true)
	}, [setSlippageMode, setSlippageInputFocused])

	const displayValue = useMemo(
		() => (isAutoMode ? defaultDisplay : slippageInput),
		[isAutoMode, slippageInput, defaultDisplay],
	)

	return {
		isCustom: !isAutoMode,
		display: displayValue,
		toggle: toggleMode,
		handleChange: handleInputChange,
		handleBlur,
		handleFocus,
	}
}

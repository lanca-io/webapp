import { useState, useEffect, useCallback, useMemo } from 'react'
import { defaultSlippage } from '../store/settings/CreateSettingsStore'
import { normalizeSlippageInput } from '../utils/new/input'
import { useDebounce } from './useDebounce'
import { useSettingsStore } from '../store/settings/useSettings'

const MIN = 0.0001
const MAX = 0.99
const DEBOUNCE = 1000
const VALID_INPUT = /^(?:\d{1,2}(?:\.\d{0,2})?|\.\d{1,2})?$/

export function useHandleSlippageInput() {
	const { slippage, setSlippage } = useSettingsStore()
	const [isCustom, setIsCustom] = useState(() => slippage !== defaultSlippage)
	const [input, setInput] = useState('')
	const debouncedValue = useDebounce(input, DEBOUNCE)

	const converters = useMemo(
		() => ({
			show: (value: string) => {
				const num = Number(value) * 100
				return Number.isInteger(num) ? `${num}%` : `${num.toFixed(2)}%`
			},
			store: (value: string) => (Number(value.replace('%', '')) / 100).toFixed(4),
		}),
		[],
	)

	useEffect(() => {
		if (!isCustom || !debouncedValue) return

		const raw = debouncedValue.replace('%', '')
		if (!raw || !VALID_INPUT.test(raw)) return

		const percent = Number(raw)
		const decimal = percent / 100

		if (percent > 99) {
			setInput('99%')
			setSlippage(MAX.toFixed(4))
			return
		}

		const clampedDecimal = Math.min(Math.max(decimal, MIN), MAX)
		const exactSlippage = (Math.round(clampedDecimal * 10000) / 10000).toFixed(4)

		setSlippage(exactSlippage)
	}, [debouncedValue, isCustom, setSlippage])

	useEffect(() => {
		if (slippage === defaultSlippage) {
			setIsCustom(false)
			setInput('')
		} else {
			setIsCustom(true)
			setInput(converters.show(slippage))
		}
	}, [slippage, converters.show])

	const toggle = useCallback(() => {
		setIsCustom(prev => {
			if (!prev) setInput('')
			else setSlippage(defaultSlippage)
			return !prev
		})
	}, [setSlippage])

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const clean = normalizeSlippageInput(e.target.value)
		const numeric = Number(clean.replace('%', ''))
		if (numeric > 99) {
			setInput('99%')
			return
		}
		if (!VALID_INPUT.test(clean.replace('%', ''))) return
		setInput(clean)
	}, [])

	const handleBlur = useCallback(() => {
		if (!input) {
			setSlippage(defaultSlippage)
			return
		}

		const decimal = Number(converters.store(input))
		if (decimal < MIN || decimal > MAX) {
			setSlippage(defaultSlippage)
			setIsCustom(false)
			setInput('')
		}
	}, [input, setSlippage, converters.store])

	return {
		isCustom,
		display: isCustom ? input : converters.show(defaultSlippage),
		toggle,
		handleChange,
		handleBlur,
	}
}

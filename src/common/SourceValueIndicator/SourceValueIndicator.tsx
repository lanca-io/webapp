import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useValueConversion } from '../../hooks/useValueConversion'
import { useFormStore } from '../../store/form/useFormStore'
import { SwapIcon } from '../../assets/icons/SwapIcon'
import { Mode } from '../../store/form/types'
import { format } from '../../utils/new/format'
import './SourceValueIndicator.pcss'

export const SourceValueIndicator: FC = () => {
	const { usd, token, isUsdMode } = useValueConversion()
	const { setInputValue, setInputMode, sourceToken } = useFormStore()

	const [displayValue, inputValue, symbolElement] = useMemo(() => {
		const rawValue = isUsdMode ? token : usd
		const numericValue = Number(rawValue)
		const isValid = !isNaN(numericValue)

		return [
			isValid ? format(numericValue, 2, isUsdMode ? '' : '$') : null,
			isValid ? rawValue : '',
			isUsdMode ? sourceToken?.symbol : '',
		]
	}, [usd, token, isUsdMode, sourceToken?.symbol])

	const handleClick = useCallback(() => {
		if (!inputValue) return
		setInputValue(isUsdMode ? inputValue : `${inputValue}$`)
		setInputMode(isUsdMode ? Mode.Number : Mode.Dollar)
	}, [inputValue, isUsdMode, setInputValue, setInputMode])

	if (!displayValue) {
		return (
			<div className="src_value_indicator">
				<span className="src_value_indicator_equal">-</span>
			</div>
		)
	}

	return (
		<div className="src_value_indicator" onClick={handleClick} role="button" tabIndex={0}>
			<span className="src_value_indicator_equal">=</span>
			<span className="src_value_indicator_value">{displayValue}</span>
			<span className="src_value_indicator_value">{symbolElement}</span>
			<span className="src_value_indicator_icon">
				<SwapIcon />
			</span>
		</div>
	)
}

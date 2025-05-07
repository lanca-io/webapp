import type { FC } from 'react'
import { useValueConversion } from '../../hooks/useValueConversion'
import { useFormStore } from '../../store/form/useFormStore'
import { SwapIcon } from '../../assets/icons/SwapIcon'
import { Mode } from '../../store/form/types'
import './ValueIndicator.pcss'

export const ValueIndicator: FC = () => {
	const { usd, token, isUsdMode } = useValueConversion()
	const { setInputValue, setInputMode } = useFormStore()

	const value = isUsdMode ? token : usd
	const inputValue = (isUsdMode ? token : usd)?.replace(/[^\d.]/g, '') || ''

	const handleClick = () => {
		if (!value || !inputValue) return
		setInputValue(isUsdMode ? inputValue : `$${inputValue}`)
		setInputMode(isUsdMode ? Mode.Number : Mode.Dollar)
	}

	if (!value) {
		return (
			<div className="value_indicator">
				<span className="value_indicator_equal">-</span>
			</div>
		)
	}

	return (
		<div
			className="value_indicator"
			onClick={handleClick}
			role="button"
			tabIndex={0}
			aria-label={`Switch to ${isUsdMode ? 'token' : 'USD'} input`}
		>
			<span className="value_indicator_equal">=</span>
			<span className="value_indicator_value">{value}</span>
			<span className="value_indicator_icon">
				<SwapIcon />
			</span>
		</div>
	)
}

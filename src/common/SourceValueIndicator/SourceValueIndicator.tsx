import type { FC } from 'react'
import { useMemo } from 'react'
import { useValueConversion } from '../../hooks/useValueConversion'
import { useFormStore } from '../../store/form/useFormStore'
import { SwapIcon } from '../../assets/icons/SwapIcon'
import { Mode } from '../../store/form/types'
import { format } from '../../utils/new/format'
import './SourceValueIndicator.pcss'

export const SourceValueIndicator: FC = () => {
	const { usd, token, isUsdMode } = useValueConversion()
	const { setInputValue, setInputMode, sourceToken } = useFormStore()

	const value = useMemo(() => {
		const raw = isUsdMode ? token : usd
		if (!raw || isNaN(Number(raw))) return null
		const symbol = isUsdMode ? '' : '$'
		return format(Number(raw), 2, symbol)
	}, [usd, token, isUsdMode, sourceToken])

	const inputValue = useMemo(() => {
		const raw = isUsdMode ? token : usd
		return raw && !isNaN(Number(raw)) ? raw : ''
	}, [usd, token, isUsdMode])

	const handleClick = () => {
		if (!inputValue) return
		setInputValue(isUsdMode ? inputValue : `${inputValue}$`)
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
			className="src_value_indicator"
			onClick={handleClick}
			role="button"
			tabIndex={0}
			aria-label={`Switch to ${isUsdMode ? sourceToken?.symbol || 'token' : 'USD'} input`}
		>
			<span className="src_value_indicator_equal">=</span>
			<span className="src_value_indicator_value">{value}</span>
			<span className="src_value_indicator_value">{isUsdMode ? sourceToken?.symbol : ''}</span>
			<span className="src_value_indicator_icon">
				<SwapIcon />
			</span>
		</div>
	)
}

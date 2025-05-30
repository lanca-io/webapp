import { memo, useCallback } from 'react'
import { useValueConversion } from '../../../hooks/useValueConversion'
import { useFormStore } from '../../../store/form/useFormStore'
import { SwapIcon } from '../../../assets/icons/SwapIcon'
import { Mode } from '../../../store/form/types'
import { format } from '../../../utils/new/format'
import './SourceValue.pcss'

export const SourceValue = memo((): JSX.Element => {
	const { usd, token, isUsdMode } = useValueConversion()
	const { setAmountInput, setAmountInputMode, fromToken } = useFormStore()

	const raw = isUsdMode ? token : usd
	const num = Number(raw)
	const isValid = raw && !isNaN(num) && num > 0

	const display = isValid ? format(num, 2, isUsdMode ? '' : '$') : null
	const symbol = isUsdMode && fromToken?.symbol ? fromToken.symbol : ''

	const handleClick = useCallback(() => {
		if (!raw) return
		setAmountInput(isUsdMode ? raw : `${raw}$`)
		setAmountInputMode(isUsdMode ? Mode.Number : Mode.Dollar)
	}, [raw, isUsdMode, setAmountInput, setAmountInputMode])

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (['Enter', ' '].includes(e.key)) handleClick()
		},
		[handleClick],
	)

	if (!display) {
		return (
			<div className="src_value_indicator" aria-hidden="true">
				<span className="src_value_indicator_equal">-</span>
			</div>
		)
	}

	return (
		<div
			className="src_value_indicator"
			onClick={handleClick}
			onKeyDown={handleKeyPress}
			role="button"
			tabIndex={0}
			aria-label={`Toggle value display to ${isUsdMode ? 'token amount' : 'USD'}`}
		>
			<span className="src_value_indicator_equal">=</span>
			<span className="src_value_indicator_value">
				{display}
				{symbol && ` ${symbol}`}
			</span>
			<span className="src_value_indicator_icon" aria-hidden="true">
				<SwapIcon />
			</span>
		</div>
	)
})

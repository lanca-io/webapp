import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useValueConversion } from '../../hooks/useValueConversion'
import { useFormStore } from '../../store/form/useFormStore'
import { SwapIcon } from '../../assets/icons/SwapIcon'
import { Mode } from '../../store/form/types'
import { format } from '../../utils/new/format'
import './SourceValue.pcss'

export const SourceValue: FC = () => {
	const { usd, token, isUsdMode } = useValueConversion()
	const { setInputValue, setInputMode, sourceToken } = useFormStore()

	const { display, value, symbol } = useMemo(() => {
		const raw = isUsdMode ? token : usd
		const num = Number(raw)

		if (!raw || isNaN(num) || num <= 0) {
			return { display: null, value: '', symbol: '' }
		}

		return {
			display: format(num, 2, isUsdMode ? '' : '$'),
			value: raw,
			symbol: isUsdMode && sourceToken?.symbol ? sourceToken.symbol : '',
		}
	}, [usd, token, isUsdMode, sourceToken?.symbol])

	const handleClick = useCallback(() => {
		if (!value) return
		setInputValue(isUsdMode ? value : `${value}$`)
		setInputMode(isUsdMode ? Mode.Number : Mode.Dollar)
	}, [value, isUsdMode, setInputValue, setInputMode])

	if (!display) {
		return (
			<div className="src_value_indicator">
				<span className="src_value_indicator_equal">-</span>
			</div>
		)
	}

	return (
		<div className="src_value_indicator" onClick={handleClick} role="button" tabIndex={0}>
			<span className="src_value_indicator_equal">=</span>
			<span className="src_value_indicator_value">{display}</span>
			{symbol && <span className="src_value_indicator_value">{symbol}</span>}
			<span className="src_value_indicator_icon">
				<SwapIcon />
			</span>
		</div>
	)
}

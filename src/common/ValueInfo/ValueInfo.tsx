import type { FC } from 'react'
import { useFormStore } from '../../store/form/useFormStore'
import { Mode } from '../../store/form/types'
import { useMemo } from 'react'
import { useDollarEquivalent } from '../../hooks/useDollarEquivalent'
import './ValueInfo.pcss'

export const ValueInfo: FC = () => {
	const { dollarValue } = useDollarEquivalent()
	const { error, inputValue, inputMode, amount } = useFormStore()

	const isDollarMode = useMemo(() => inputMode === Mode.Dollar, [inputMode])
	const isNoneMode = useMemo(() => inputMode === Mode.None || !inputValue.trim(), [inputMode, inputValue])
	const isError = useMemo(() => Boolean(error), [error])
	const hasAmount = useMemo(() => Boolean(amount), [amount])

	return (
		<div className="value_info_container">
			{isError && <span className="value_info_title value_info_error">{error}</span>}
			{isNoneMode && <span className="value_info_title">Enter amount</span>}
			{isDollarMode && <span className="value_info_title">-</span>}
			{!isError && !isNoneMode && !isDollarMode && hasAmount && dollarValue && (
				<span className="value_info_title">{`≈ ${dollarValue}`}</span>
			)}
		</div>
	)
}

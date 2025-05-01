import type { FC } from 'react'
import { useFormStore } from '../../store/form/useFormStore'
import { Mode } from '../../store/form/types'
import { useMemo } from 'react'
import { useDollarEquivalent } from '../../hooks/useDollarEquivalent'
import './ValueInfo.pcss'

export const ValueInfo: FC = () => {
	const { error, inputValue, inputMode } = useFormStore()
	const { dollarValue } = useDollarEquivalent()

	const displayText = useMemo(() => {
		if (error) {
			return error
		}

		if (inputMode === Mode.Dollar) {
			return '-'
		}

		if (inputMode === Mode.None || !inputValue.trim()) {
			return 'Enter amount'
		}

		return dollarValue !== null ? `≈ ${dollarValue}` : 'Calculating...'
	}, [dollarValue, error, inputMode, inputValue])

	const isError = useMemo(() => Boolean(error), [error])

	return (
		<div className="value_info_container">
			<span className={isError ? 'value_info_error' : 'value_info'}>{displayText}</span>
		</div>
	)
}

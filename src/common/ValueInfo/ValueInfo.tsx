import type { FC } from 'react'
import { useFormStore } from '../../store/form/useFormStore'
import { Mode } from '../../store/form/types'
import { useMemo } from 'react'
import { useDollarEquivalent } from '../../hooks/useDollarEquivalent'
import './ValueInfo.pcss'

type ValueInfoProps = {
	mode: Mode
	value?: string
	token?: any
}

export const ValueInfo: FC<ValueInfoProps> = ({ mode, value = '', token = null }) => {
	const { error } = useFormStore()
	const { dollarValue } = useDollarEquivalent(value, mode, token)

	const displayText = useMemo(() => {
		if (error) {
			return error
		}

		if (mode === Mode.Dollar) {
			return '-'
		}

		if (mode === Mode.None || !value.trim()) {
			return 'Enter amount'
		}

		return dollarValue !== null ? `≈ ${dollarValue}` : 'Calculating...'
	}, [dollarValue, error, mode, value])

	const isError = useMemo(() => Boolean(error), [error])

	return (
		<div className="value_info_container">
			<span className={isError ? 'value_info_error' : 'value_info'}>{displayText}</span>
		</div>
	)
}

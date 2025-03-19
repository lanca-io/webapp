import type { FC } from 'react'
import { useFormStore } from '../../../../store/form/useFormStore'
import classNames from './InfoDisplay.module.pcss'
import { InfoDisplayProps } from './types'
import { Mode } from '../types'
import { useComputeDollarValue } from '../useComputeDollarValue'

export const InfoDisplay: FC<InfoDisplayProps> = ({ value, token, mode }) => {
	const { error } = useFormStore()
	const { dollarValue } = useComputeDollarValue(value, mode, token)

	return (
		<div className={classNames['info-display']}>
			{!error && <span className={classNames['info']}>{mode === Mode.Dollar ? '-' : `= ${dollarValue}`}</span>}
			{error && <span className={classNames['error']}>{error}</span>}
		</div>
	)
}

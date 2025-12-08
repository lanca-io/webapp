import { useMemo } from 'react'
import { InfoIcon } from '../../../../../../assets/icons/InfoIcon'
import classNames from './InputError.module.pcss'

interface Props {
	errorText: string
	color?: string
}

export const InputError = ({ errorText, color = 'red' }: Props) => {
	const containerClass = useMemo(() => classNames.container, [])
	const textClass = useMemo(() => `${classNames.text} body2`, [])

	return (
		<div className={containerClass}>
			<InfoIcon color={color} />
			<p className={textClass}>{errorText}</p>
		</div>
	)
}

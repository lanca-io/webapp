import { type FC } from 'react'
import { Loader } from '../Loader/Loader'
import classNames from './TransactionStep.module.pcss'
import { InfoIcon } from '../../../assets/icons/InfoIcon'
import { SuccessIcon } from '../../../assets/icons/SuccessIcon'

interface StageProps {
	title: string
	status: 'pending' | 'success' | 'error' | 'idle'
}

export const TransactionStep: FC<StageProps> = ({ status, title }) => {
	const renderIcon = () => {
		switch (status) {
			case 'idle':
				return null
			case 'pending':
				return <Loader variant="neutral" />
			case 'error':
				return <InfoIcon color="var(--color-danger-700)" />
			case 'success':
				return <SuccessIcon />
			default:
				return null
		}
	}

	return (
		<div className={classNames.step}>
			{renderIcon()}
			<h4 className={classNames[status]}>{title}</h4>
		</div>
	)
}

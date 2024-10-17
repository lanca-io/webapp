import { type FC } from 'react'
import { Loader } from '../Loader/Loader'
import classNames from './TransactionStep.module.pcss'
import { InfoIcon } from '../../../assets/icons/InfoIcon'
import { SuccessIcon } from '../../../assets/icons/SuccessIcon'
import { type Status } from '../../../sdk/types/executeSettingsTypes'

interface StageProps {
	title: string
	status: Status | null | undefined
}

export const TransactionStep: FC<StageProps> = ({ status, title }) => {
	const renderIcon = () => {
		switch (status) {
			case 'idle':
				return null
			case 'pending':
			case 'await':
				return <Loader variant="neutral" />
			case 'failed':
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
			<h4 className={classNames[status ?? 'idle']}>{title}</h4>
		</div>
	)
}

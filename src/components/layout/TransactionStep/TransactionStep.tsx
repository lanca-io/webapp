import { type FC } from 'react'
import { Loader } from '../Loader/Loader'
import classNames from './TransactionStep.module.pcss'
import { InfoIcon } from '../../../assets/icons/InfoIcon'
import { SuccessIcon } from '../../../assets/icons/SuccessIcon'
import { Status } from 'lanca-sdk-demo'

interface StageProps {
	title: string
	status: Status | null | undefined
}

const statusClassNames = {
	[Status.NOT_STARTED]: 'idle',
	[Status.PENDING]: 'pending',
	[Status.REJECTED]: 'error',
	[Status.FAILED]: 'error',
	[Status.SUCCESS]: 'success',
}

export const TransactionStep: FC<StageProps> = ({ status, title }) => {
	const renderIcon = () => {
		switch (status) {
			case Status.NOT_STARTED:
				return null
			case Status.PENDING:
				return <Loader variant="neutral" />
			case Status.REJECTED:
			case Status.FAILED:
				return <InfoIcon color="var(--color-danger-700)" />
			case Status.SUCCESS:
				return <SuccessIcon />
			default:
				return null
		}
	}

	return (
		<div className={classNames.step}>
			{renderIcon()}
			<h4 className={classNames[statusClassNames[status ?? Status.NOT_STARTED]]}>{title}</h4>
		</div>
	)
}

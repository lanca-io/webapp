import { type FC } from 'react'
import { Loader } from '../Loader/Loader'
import classNames from './TransactionStep.module.pcss'

interface StageProps {
	step: StageStep
}

export interface StageStep {
	title: string
	body?: string
	status: 'pending' | 'success' | 'error' | 'await'
	txLink?: string
}

const renderTag = (status: string) => {
	const iconSize = 18

	const content = () => {
		switch (status) {
			case 'pending':
				return <Loader variant="neutral" />
			case 'await':
				return <Loader variant="neutral" />
			case 'error':
				return null
			default:
				return <div style={{ width: iconSize, height: iconSize }} />
		}
	}

	return <div className={`${classNames.tagContainer} ${classNames[status]}`}>{content()}</div>
}

export const TransactionStep: FC<StageProps> = ({ step }) => {
	const { title, status } = step

	return (
		<div className={classNames.step}>
			{renderTag(status)}
			<h4 className={classNames.titleContainer}>{title}</h4>
		</div>
	)
}

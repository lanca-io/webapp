import { type FC, type ReactNode } from 'react'
import classNames from './CardHeader.module.pcss'
import { Loader } from '../../layout/Loader/Loader'

interface CardHeaderProps {
	title?: string
	children?: ReactNode
	isLoading?: boolean
}

export const CardHeader: FC<CardHeaderProps> = ({ title = null, children, isLoading = false }) => (
	<div className={classNames.cardHeader}>
		{title ? (
			<div className={classNames.titleContainer}>
				<h5 className={'cardHeaderTitle'}>{title}</h5>
				<div>{isLoading ? <Loader size={13} color={'var(--color-text-secondary)'} /> : null}</div>
			</div>
		) : null}
		{children}
	</div>
)

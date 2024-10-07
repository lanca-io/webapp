import classNames from './Modal.module.pcss'
import { IconButton } from '../../buttons/IconButton/IconButton'
import { TrailArrowLeftIcon } from '../../../assets/icons/TrailArrowLeftIcon'

interface ModalHeaderProps {
	title: string
	onClick: () => void
}

export function ModalHeader({ title, onClick }: ModalHeaderProps) {
	return (
		<div className={classNames.header}>
			<IconButton onClick={onClick} variant="secondary" size="md">
				<TrailArrowLeftIcon />
			</IconButton>
			<div className={classNames.titleContainer}>
				<h5>{title}</h5>
			</div>
		</div>
	)
}

import classNames from './Modal.module.pcss'
import { IconButton } from '../../layout/buttons/IconButton/IconButton'
import { TrailArrowLeftIcon } from '../../../assets/icons/TrailArrowLeftIcon'

interface ModalHeaderProps {
	title: string
	onClick: () => void
}

export function ModalHeader({ title, onClick }: ModalHeaderProps) {
	return (
		<div className={classNames.header}>
			<IconButton onClick={onClick} variant="secondary" size="sm">
				<TrailArrowLeftIcon />
			</IconButton>
			<h4 className={classNames.titleContainer}>{title}</h4>
		</div>
	)
}

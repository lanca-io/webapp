import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import { IconButton } from '@concero/ui-kit'
import { TrailArrowLeftIcon } from '../../../../assets/icons/TrailArrowLeftIcon'
import './ModalHeader.pcss'

export type ModalHeaderProps = {
	title: string
	onClose: () => void
}

export const ModalHeader: FC<ModalHeaderProps> = ({ title, onClose }) => {
	const handleClose = useCallback(() => {
		onClose()
	}, [onClose])

	const icon = useMemo(() => <TrailArrowLeftIcon />, [])

	const closeButton = useMemo(
		() => (
			<IconButton onClick={handleClose} variant="secondary" size="m">
				{icon}
			</IconButton>
		),
		[handleClose, icon],
	)

	return (
		<div className="modal_header">
			{closeButton}
			<h4 className="modal_header_title">{title}</h4>
		</div>
	)
}

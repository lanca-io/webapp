import type { FC } from 'react'
import { memo, useCallback } from 'react'
import { IconButton } from '@concero/ui-kit'
import { TrailArrowLeftIcon } from '../../../assets/icons/TrailArrowLeftIcon'
import './ModalHeader.pcss'

export type ModalHeaderProps = {
	title: string
	onClose: () => void
}

export const ModalHeader: FC<ModalHeaderProps> = memo(({ title, onClose }) => {
	const handleClose = useCallback(() => {
		onClose()
	}, [onClose])

	return (
		<div className="modal_header">
			<IconButton onClick={handleClose} variant="secondary" size="m">
				<TrailArrowLeftIcon />
			</IconButton>
			<h4 className="modal_header_title">{title}</h4>
		</div>
	)
})

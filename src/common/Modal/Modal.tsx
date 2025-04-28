import type { FC, PropsWithChildren } from 'react'
import { memo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ModalHeader } from './ModalHeader/ModalHeader'
import './Modal.pcss'

type ModalProps = {
	isOpen: boolean
	title: string
	onClose: () => void
}

export const Modal: FC<PropsWithChildren<ModalProps>> = memo(({ isOpen, title, onClose, children }) => {
	const handleClose = useCallback(() => onClose(), [onClose])

	if (!isOpen) return null

	return createPortal(
		<div className="modal_backdrop">
			<div className="modal">
				<ModalHeader title={title} onClose={handleClose} />
				{children}
			</div>
		</div>,
		document.body,
	)
})

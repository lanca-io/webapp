import type { FC, PropsWithChildren } from 'react'
import { useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { ModalHeader } from './ModalHeader/ModalHeader'
import './Modal.pcss'

type ModalProps = {
	isOpen: boolean
	title: string
	onClose: () => void
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({ isOpen, title, onClose, children }) => {
	const handleClose = useCallback(() => onClose(), [onClose])

	const header = useMemo(() => <ModalHeader title={title} onClose={handleClose} />, [title, handleClose])

	if (!isOpen) return null

	return createPortal(
		<div className="modal_backdrop">
			<div className="modal">
				{header}
				{children}
			</div>
		</div>,
		document.body,
	)
}

Modal.displayName = 'Modal'

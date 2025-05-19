import type { FC, PropsWithChildren, ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { ModalHeader } from './ModalHeader/ModalHeader'
import './Modal.pcss'

type ModalProps = {
	isOpen: boolean
	title: string
	onClose: () => void
	modalExtension?: ReactNode
	className?: string
	extensionClassName?: string
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
	isOpen,
	title,
	onClose,
	modalExtension,
	children,
	className = '',
	extensionClassName = '',
}) => {
	const handleClose = useCallback(() => onClose(), [onClose])
	const header = useMemo(() => <ModalHeader title={title} onClose={handleClose} />, [title, handleClose])

	if (!isOpen) return null

	return createPortal(
		<div className="modal_backdrop">
			<div className={`modal${className ? ` ${className}` : ''}`}>
				{header}
				{children}
			</div>
			{modalExtension && (
				<div className={`modal modal_secondary${extensionClassName ? ` ${extensionClassName}` : ''}`}>
					{modalExtension}
				</div>
			)}
		</div>,
		document.body,
	)
}

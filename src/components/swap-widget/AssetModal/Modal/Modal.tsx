import type { FC, PropsWithChildren } from 'react'
import type { ModalProps } from './types'

import classNames from './Modal.module.pcss'
import { ModalHeader } from './ModalHeader/ModalHeader'

export const Modal: FC<PropsWithChildren<ModalProps>> = ({ isOpen, title, onClose, children }) => {
	if (!isOpen) return null
	return (
		<div className={classNames['backdrop']}>
			<div className={classNames['modal']}>
				<ModalHeader title={title} onClose={onClose} />
				{children}
			</div>
		</div>
	)
}

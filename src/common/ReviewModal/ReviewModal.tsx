import type { FC } from 'react'
import { Modal } from '../Modal/Modal'

type ReviewModalProps = {
	isOpen: boolean
	onClose: () => void
}

export const ReviewModal: FC<ReviewModalProps> = ({ isOpen, onClose }) => {
	return <Modal isOpen={isOpen} title="Review" onClose={onClose}></Modal>
}

import type { FC } from 'react'
import { Modal } from '../Modal/Modal'
import { ReviewSection } from '../ReviewSection/ReviewSection'
import './ReviewModal.pcss'

type ReviewModalProps = {
	isOpen: boolean
	onClose: () => void
}

export const ReviewModal: FC<ReviewModalProps> = ({ isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} title="Review" onClose={onClose}>
			<ReviewSection />
		</Modal>
	)
}

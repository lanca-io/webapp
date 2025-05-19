import { memo } from 'react'
import { Modal } from '../Modal/Modal'
import { ReviewSection } from '../ReviewSection/ReviewSection'
import { RouteSection } from '../RouteSection/RouteSection'
import './ReviewModal.pcss'

type ReviewModalProps = {
	isOpen: boolean
	onClose: () => void
}

export const ReviewModal = memo(
	({ isOpen, onClose }: ReviewModalProps): JSX.Element => (
		<Modal
			isOpen={isOpen}
			className="review_modal"
			extensionClassName="review_modal_extension"
			title="Review"
			onClose={onClose}
			modalExtension={<RouteSection />}
			onBackdropClick={onClose}
		>
			<ReviewSection />
		</Modal>
	),
)

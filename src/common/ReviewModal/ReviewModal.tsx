import { memo } from 'react'
import { Modal } from '../Modal/Modal'
import { ReviewSection } from '../ReviewSection/ReviewSection'
import { RouteSection } from '../RouteSection/RouteSection'

type ReviewModalProps = {
	isOpen: boolean
	onClose: () => void
}

export const ReviewModal = memo(
	({ isOpen, onClose }: ReviewModalProps): JSX.Element => (
		<Modal isOpen={isOpen} title="Review" onClose={onClose} modalExtension={<RouteSection />}>
			<ReviewSection />
		</Modal>
	),
)

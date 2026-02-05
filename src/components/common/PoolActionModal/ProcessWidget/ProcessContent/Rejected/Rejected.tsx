import type { FC } from 'react'
import { memo } from 'react'
import './Rejected.pcss'

export const Rejected: FC = memo((): JSX.Element => {
	const imageSrc = '/Swap/NotFound.webp'
	const altText = 'Failure Process'

	return (
		<div className="pool_action_rejected_content">
			<img
				src={imageSrc}
				alt={altText}
				className="pool_action_rejected_content_image"
				data-testid="failure-image"
			/>
		</div>
	)
})

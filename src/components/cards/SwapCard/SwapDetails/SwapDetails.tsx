import { type FC, useEffect, useRef, useState } from 'react'
import classNames from './SwapDetails.module.pcss'
import { type SwapDetailsProps } from '../types'
import { animated, useSpring } from '@react-spring/web'
import { easeQuadInOut } from 'd3-ease'
import { ReviewRouteCard } from './ReviewRouteCard/ReviewRouteCard'
import { RouteDetailsModal } from './RouteDetailsModal/RouteDetailsModal'

export const SwapDetails: FC<SwapDetailsProps> = ({ swapState }) => {
	const [animatedContainerHeight, setAnimatedContainerHeight] = useState<number>(0)
	const [isReviewRouteModalVisible, setIsReviewRouteModalVisible] = useState<boolean>(false)
	const reviewRouteCardRef = useRef<HTMLDivElement>(null)
	const { selectedRoute } = swapState

	const isInputStage = swapState.stage === 'input'

	const containerAnimation = useSpring({
		height: selectedRoute && !isInputStage ? animatedContainerHeight : 0,
		opacity: selectedRoute && !isInputStage ? 1 : 0,
		config: { duration: 200, easing: easeQuadInOut },
	})

	useEffect(() => {
		if (!reviewRouteCardRef.current) return
		setAnimatedContainerHeight(reviewRouteCardRef.current.scrollHeight)
	}, [reviewRouteCardRef.current?.scrollHeight, swapState.stage])

	return (
		<animated.div style={containerAnimation}>
			<div className={classNames.swapDetailsContainer}>
				<div
					className={classNames.reviewContainer}
					ref={reviewRouteCardRef}
					onClick={() => {
						setIsReviewRouteModalVisible(true)
					}}
				>
					<ReviewRouteCard selectedRoute={selectedRoute} />
				</div>
			</div>
			{selectedRoute && (
				<RouteDetailsModal
					selectedRoute={selectedRoute}
					isOpen={isReviewRouteModalVisible}
					setIsOpen={setIsReviewRouteModalVisible}
				/>
			)}
		</animated.div>
	)
}

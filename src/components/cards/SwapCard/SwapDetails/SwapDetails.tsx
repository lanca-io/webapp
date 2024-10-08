import { type FC, useEffect, useRef, useState } from 'react'
import classNames from './SwapDetails.module.pcss'
import { type SwapDetailsProps } from '../types'
import { animated, useSpring } from '@react-spring/web'
import { easeQuadInOut } from 'd3-ease'
import { ReviewRouteCard } from './ReviewRouteCard/ReviewRouteCard'
import { RouteDetailsModal } from './RouteDetailsModal/RouteDetailsModal'
import { Alert } from '../../../layout/Alert/Alert'
import { Separator } from '../../../layout/Separator/Separator'

export const SwapDetails: FC<SwapDetailsProps> = ({ swapState }) => {
	const [animatedContainerHeight, setAnimatedContainerHeight] = useState<number>(0)
	const [isReviewRouteModalVisible, setIsReviewRouteModalVisible] = useState<boolean>(false)
	const reviewRouteCardRef = useRef<HTMLDivElement>(null)
	const { selectedRoute, isNoRoutes } = swapState

	const containerAnimation = useSpring({
		height: selectedRoute || isNoRoutes ? animatedContainerHeight : 0,
		opacity: selectedRoute || isNoRoutes ? 1 : 0,
		config: { duration: 200, easing: easeQuadInOut },
	})

	useEffect(() => {
		if (!reviewRouteCardRef.current) return

		setAnimatedContainerHeight(isNoRoutes ? 80 : 147)
	}, [reviewRouteCardRef.current, swapState.stage])

	return (
		<animated.div style={containerAnimation}>
			<div ref={reviewRouteCardRef} className={classNames.swapDetailsContainer}>
				<div
					className={classNames.reviewContainer}
					onClick={() => {
						setIsReviewRouteModalVisible(true)
					}}
				>
					{isNoRoutes ? (
						<Alert title={'Routs not found'} variant="error" />
					) : (
						<ReviewRouteCard selectedRoute={selectedRoute} />
					)}
					<Separator />
				</div>
				{selectedRoute && (
					<RouteDetailsModal
						selectedRoute={selectedRoute}
						isOpen={isReviewRouteModalVisible}
						setIsOpen={setIsReviewRouteModalVisible}
					/>
				)}
			</div>
		</animated.div>
	)
}

import { type FC, useEffect, useRef, useState } from 'react'
import classNames from './SwapDetails.module.pcss'
import { type SwapDetailsProps } from '../types'
import { animated, useSpring } from '@react-spring/web'
import { easeQuadInOut } from 'd3-ease'
import { ReviewRouteCard } from './ReviewRouteCard/ReviewRouteCard'
import { RouteDetailsModal } from './RouteDetailsModal/RouteDetailsModal'
import { Alert } from '../../../layout/Alert/Alert'
import { Separator } from '../../../layout/Separator/Separator'
import { ErrorCategory, errorTextMap, errorTypeMap } from '../SwapButton/constants'

export const SwapDetails: FC<SwapDetailsProps> = ({ swapState }) => {
	const [animatedContainerHeight, setAnimatedContainerHeight] = useState<number>(0)
	const [isReviewRouteModalVisible, setIsReviewRouteModalVisible] = useState<boolean>(false)
	const reviewRouteCardRef = useRef<HTMLDivElement>(null)
	const { selectedRoute, inputError } = swapState

	const amountUsdFrom = swapState.from.amount
		? Number(swapState.from.amount) * Number(swapState.from.token.priceUsd)
		: 0
	const amountUsdTo = swapState.to.amount ? Number(swapState.to.amount) * Number(swapState.to.token.priceUsd) : 0

	const totalFeeUsd = amountUsdFrom - amountUsdTo

	const isTransactionError = inputError ? errorTypeMap[inputError] === ErrorCategory.transaction : false
	const isError = inputError && isTransactionError

	const containerAnimation = useSpring({
		height: selectedRoute || isError ? animatedContainerHeight : 0,
		opacity: selectedRoute || isError ? 1 : 0,
		config: { duration: 200, easing: easeQuadInOut },
	})

	useEffect(() => {
		if (!reviewRouteCardRef.current) return

		setAnimatedContainerHeight(isError ? 80 : 120)
	}, [reviewRouteCardRef.current, swapState.stage, inputError])

	return (
		<animated.div style={containerAnimation}>
			<div ref={reviewRouteCardRef} className={classNames.swapDetailsContainer}>
				<div
					className={classNames.reviewContainer}
					onClick={() => {
						setIsReviewRouteModalVisible(true)
					}}
				>
					{isError ? (
						<Alert title={errorTextMap[inputError]} variant="error" />
					) : (
						<ReviewRouteCard selectedRoute={selectedRoute} />
					)}
					<Separator />
				</div>
				{selectedRoute && (
					<RouteDetailsModal
						amountUsd={totalFeeUsd}
						selectedRoute={selectedRoute}
						isOpen={isReviewRouteModalVisible}
						setIsOpen={setIsReviewRouteModalVisible}
					/>
				)}
			</div>
		</animated.div>
	)
}

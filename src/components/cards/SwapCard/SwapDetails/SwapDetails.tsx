import { type FC, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { type SwapDetailsProps } from '../types'
import { animated, useSpring } from '@react-spring/web'
import { easeQuadInOut } from 'd3-ease'
import { ReviewRoute } from './ReviewRoute/ReviewRoute'
import { ReviewModal } from './ReviewModal/ReviewModal'
import { Alert } from '../../../layout/Alert/Alert'
import { Separator } from '../../../layout/Separator/Separator'
import { ErrorCategory, errorTextMap, errorTypeMap } from '../SwapButton/constants'

import classNames from './SwapDetails.module.pcss'

export const SwapDetails: FC<SwapDetailsProps> = ({ swapState }) => {
	const { selectedRoute, inputError, from, to, stage } = swapState

	const [containerHeight, setContainerHeight] = useState<number>(0)
	const [isReviewModalVisible, setIsReviewModalVisible] = useState<boolean>(false)

	const reviewCardRef = useRef<HTMLDivElement>(null)

	const amountUsdFrom = useMemo(
		() => (from.amount ? Number(from.amount) * Number(from.token.priceUsd) : 0),
		[from.amount, from.token.priceUsd],
	)
	const amountUsdTo = useMemo(
		() => (to.amount ? Number(to.amount) * Number(to.token.priceUsd) : 0),
		[to.amount, to.token.priceUsd],
	)
	const totalFeeUsd = useMemo(() => amountUsdFrom - amountUsdTo, [amountUsdFrom, amountUsdTo])

	const isTransactionError = inputError ? errorTypeMap[inputError] === ErrorCategory.transaction : false
	const isError = inputError && isTransactionError

	const containerAnimation = useSpring({
		height: selectedRoute || isError ? containerHeight : 0,
		opacity: selectedRoute || isError ? 1 : 0,
		config: { duration: 200, easing: easeQuadInOut },
	})

	useEffect(() => {
		if (!reviewCardRef.current) return

		setContainerHeight(isError ? 80 : 130)
	}, [reviewCardRef.current, stage, inputError, isError])

	const handleReviewClick = useCallback(() => {
		setIsReviewModalVisible(true)
	}, [])

	return (
		<animated.div style={containerAnimation}>
			<div ref={reviewCardRef} className={classNames.swapDetailsContainer}>
				<div className={classNames.reviewContainer} onClick={handleReviewClick}>
					{isError ? (
						<Alert title={errorTextMap[inputError]} variant="error" />
					) : (
						<ReviewRoute selectedRoute={selectedRoute} />
					)}
					<Separator />
				</div>
				{selectedRoute && (
					<ReviewModal
						amountUsd={totalFeeUsd}
						selectedRoute={selectedRoute}
						isOpen={isReviewModalVisible}
						setIsOpen={setIsReviewModalVisible}
					/>
				)}
			</div>
		</animated.div>
	)
}

import { type FC, useEffect, useRef, useState, type Dispatch, useMemo } from 'react'
import classNames from './SwapDetails.module.pcss'
import { animated, useSpring } from '@react-spring/web'
import { easeQuadInOut } from 'd3-ease'
import { Separator } from '../../../../layout/Separator/Separator'
import { type PoolAction, type PoolState, PoolCardStage } from '../poolReducer/types'

interface SwapDetailsProps {
	poolState: PoolState
	poolDispatch: Dispatch<PoolAction>
}

export const SwapDetails: FC<SwapDetailsProps> = ({ poolState }) => {
	const [animatedContainerHeight, setAnimatedContainerHeight] = useState<number>(0)
	const reviewRouteCardRef = useRef<HTMLDivElement>(null)
	const { from, poolMode, isLoading, stage } = poolState

	const isDeposit = poolMode === 'deposit'
	const isReview = stage === PoolCardStage.review

	const minAmount = useMemo(() => (isDeposit ? 100 : 0), [isDeposit])
	const amountIsAvailable = useMemo(() => Number(from.amount) >= minAmount, [from.amount, minAmount])
	const isOpen = useMemo(() => !isLoading && isReview && amountIsAvailable, [isLoading, isReview, amountIsAvailable])

	const containerAnimation = useSpring({
		height: isOpen ? animatedContainerHeight : 0,
		opacity: isOpen ? 1 : 0,
		config: { duration: 200, easing: easeQuadInOut },
	})

	useEffect(() => {
		if (!reviewRouteCardRef.current) return

		setAnimatedContainerHeight(80)
	}, [stage])

	return (
		<animated.div style={containerAnimation}>
			<div ref={reviewRouteCardRef} className={classNames.swapDetailsContainer}>
				<div className={classNames.reviewContainer}>
					<Separator />
				</div>
			</div>
		</animated.div>
	)
}

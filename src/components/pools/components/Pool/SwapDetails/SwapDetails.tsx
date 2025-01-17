import { type FC, useEffect, useRef, useState, type Dispatch, useMemo } from 'react'
import classNames from './SwapDetails.module.pcss'
import { animated, useSpring } from '@react-spring/web'
import { easeQuadInOut } from 'd3-ease'
// import { Alert } from '../../../../layout/Alert/Alert'
import { Separator } from '../../../../layout/Separator/Separator'
import { ErrorType } from '../../../config/errors/ErrorType'
// import { LancaAdd } from './LancaAdd/LancaAdd'
import { type PoolAction, type PoolState, PoolCardStage } from '../poolReducer/types'

interface SwapDetailsProps {
	poolState: PoolState
	poolDispatch: Dispatch<PoolAction>
}

export const SwapDetails: FC<SwapDetailsProps> = ({ poolState }) => {
	const [animatedContainerHeight, setAnimatedContainerHeight] = useState<number>(0)
	const reviewRouteCardRef = useRef<HTMLDivElement>(null)
	const { inputError, from, poolMode, isLoading, stage } = poolState

	const isDeposit = poolMode === 'deposit'
	const isReview = stage === PoolCardStage.review

	const minAmount = useMemo(() => (isDeposit ? 100 : 0), [isDeposit])
	const amountIsAvailable = useMemo(() => Number(from.amount) >= minAmount, [from.amount, minAmount])
	const isOpen = useMemo(() => !isLoading && isReview && amountIsAvailable, [isLoading, isReview, amountIsAvailable])

	const isInsufficientBalance = useMemo(
		() => isDeposit && inputError === ErrorType.LOW_BALANCE,
		[isDeposit, inputError],
	)

	const containerAnimation = useSpring({
		height: isOpen ? animatedContainerHeight : 0,
		opacity: isOpen ? 1 : 0,
		config: { duration: 200, easing: easeQuadInOut },
	})

	useEffect(() => {
		if (!reviewRouteCardRef.current) return

		setAnimatedContainerHeight(isInsufficientBalance ? 163 : 80)
	}, [isInsufficientBalance, stage, inputError])

	// const alert = useMemo(() => (
	//     isDeposit ? (
	//         <Alert title="Withdrawal will take 7 days" />
	//     ) : (
	//         <Alert variant="warning" title="Funds will be locked for 7 days" />
	//     )
	// ), [isDeposit])

	return (
		<animated.div style={containerAnimation}>
			<div ref={reviewRouteCardRef} className={classNames.swapDetailsContainer}>
				<div className={classNames.reviewContainer}>
					{/* {isInsufficientBalance ? <LancaAdd /> : alert} */}
					<Separator />
				</div>
			</div>
		</animated.div>
	)
}

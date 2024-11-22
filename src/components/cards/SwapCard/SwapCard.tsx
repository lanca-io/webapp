import { type Dispatch, useEffect, useRef, useState } from 'react'
import classNames from './SwapCard.module.pcss'
import { useSwapCardEffects } from './SwapCardEffects'
import { SwapInput } from './SwapInput/SwapInput'
import { SwapProgress } from './SwapProgress/SwapProgress'
import { type SwapAction, SwapCardStage, type SwapState } from './swapReducer/types'
import { Card } from '../Card/Card'
import { TrophyIcon } from '../../../assets/icons/TrophyIcon'
import { Button } from '../../layout/buttons/Button/Button'
import { fetchUserByAddress } from '../../../api/concero/user/fetchUserByAddress'
import type { Address } from 'viem'
import { ArrowRight } from '../../../assets/icons/ArrowRight'

export interface Props {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
}

export const SwapCard = ({ swapState, swapDispatch }: Props) => {
	const { selectedRoute } = swapState
	const [userPoints, setUserPoints] = useState<number>(0)

	const typingTimeoutRef = useRef<number>()
	const isInputStages = swapState.stage === SwapCardStage.input || swapState.stage === SwapCardStage.review
	const isSuccess = swapState.stage === SwapCardStage.success

	const getUser = async () => {
		try {
			return await fetchUserByAddress(swapState.from.address as Address)
		} catch (e) {
			console.log('getUser', e)
			return null
		}
	}

	const getUserPoints = async () => {
		if (!isSuccess || !selectedRoute) return

		const user = await getUser()
		const totalUserMultiplier = user
			? user.multiplier + (user?.dailySwappingMultiplier ?? 0) + (user?.liquidityHoldingMultiplier ?? 0)
			: 1

		const usdAmount = Number(selectedRoute.from.amount) * Number(selectedRoute.from.token.priceUsd)
		const newPoints = usdAmount * 0.01 * totalUserMultiplier

		setUserPoints(newPoints)
	}

	useEffect(() => {
		void getUserPoints()
	}, [swapState.stage])

	useSwapCardEffects({ swapState, swapDispatch, typingTimeoutRef })

	const handleGoBack = () => {
		swapDispatch({ type: 'RESET_AMOUNTS', direction: 'from' })
		swapDispatch({ type: 'RESET_AMOUNTS', direction: 'to' })
		swapDispatch({ type: 'CLEAR_ROUTES' })
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.input })
		swapDispatch({ type: 'SET_SWAP_STEPS', payload: [] })
	}

	return (
		<div className={classNames.container}>
			<Card className={classNames.card}>
				{isInputStages ? (
					<SwapInput swapState={swapState} swapDispatch={swapDispatch} />
				) : (
					<SwapProgress swapState={swapState} handleGoBack={handleGoBack} />
				)}
			</Card>

			{isSuccess && (
				<Card className="row ac jsb">
					<div className="row gap-sm ac">
						<div className={classNames.iconWrap}>
							<TrophyIcon />
						</div>
						<p className={classNames.pointsTitle}>
							You got <b>{userPoints.toFixed(2)} CERs</b>
						</p>
					</div>
					<a href="https://app.concero.io/rewards" target="_blank" rel="noreferrer">
						<Button
							className={classNames.rewardsButton}
							variant="tetraryColor"
							rightIcon={<ArrowRight color="#6938EF" />}
						>
							Go to rewards
						</Button>
					</a>
				</Card>
			)}
		</div>
	)
}

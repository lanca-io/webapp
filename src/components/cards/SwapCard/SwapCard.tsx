import { type Dispatch, useEffect, useRef, useState } from 'react'
import classNames from './SwapCard.module.pcss'
import { useSwapCardEffects } from './SwapCardEffects'
import { SwapInput } from './SwapInput/SwapInput'
import { SwapProgress } from './SwapProgress/SwapProgress'
import { type SwapAction, SwapActionType, SwapCardStage, type SwapState } from './swapReducer/types'
import { Card } from '../Card/Card'
import { TrophyIcon } from '../../../assets/icons/TrophyIcon'
import { Button } from '../../layout/buttons/Button/Button'
import { fetchUserByAddress } from '../../../api/concero/user/fetchUserByAddress'
import type { Address } from 'viem'
import { format } from '../../../utils/numberFormatting'
import { TokenAmounts } from '../../../utils/TokenAmounts'

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

	console.log(swapState)

	console.log(selectedRoute)

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
			? (user.multiplier.default ?? 0) + (user?.multiplier.dailySwap ?? 0) + (user?.multiplier.liquidityHold ?? 0)
			: 1

		const fromAmount = new TokenAmounts(selectedRoute.from.amount, selectedRoute.from.token.decimals)
		const usdAmount = Number(fromAmount.toParsedAmount()) * Number(selectedRoute.from.token.priceUsd)
		const newPoints = usdAmount * 0.01 * totalUserMultiplier

		setUserPoints(newPoints)
	}

	useEffect(() => {
		void getUserPoints()
	}, [swapState.stage])

	useSwapCardEffects({ swapState, swapDispatch, typingTimeoutRef })

	const handleGoBack = () => {
		swapDispatch({ type: SwapActionType.RESET_AMOUNTS, direction: 'from' })
		swapDispatch({ type: SwapActionType.RESET_AMOUNTS, direction: 'to' })
		swapDispatch({ type: SwapActionType.CLEAR_ROUTES })
		swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.input })
		swapDispatch({ type: SwapActionType.SET_SWAP_STEPS, payload: [] })
	}

	return (
		<div className={classNames.container}>
			<Card className={classNames.card}>
				{isInputStages ? (
					<SwapInput swapState={swapState} swapDispatch={swapDispatch} />
				) : (
					<SwapProgress swapState={swapState} swapDispatch={swapDispatch} handleGoBack={handleGoBack} />
				)}
			</Card>

			{isSuccess && (
				<Card className={`row ac jsb ${classNames.cardPadding}`}>
					<div className="row gap-sm ac">
						<div className={classNames.iconWrap}>
							<TrophyIcon />
						</div>
						<p className={classNames.pointsTitle}>
							You got <b>{format(userPoints, 2)} CERs</b>
						</p>
					</div>
					<a href="https://app.concero.io/rewards" target="_blank" rel="noreferrer">
						<Button className={classNames.rewardsButton} variant="tetraryColor">
							Claim
						</Button>
					</a>
				</Card>
			)}
		</div>
	)
}

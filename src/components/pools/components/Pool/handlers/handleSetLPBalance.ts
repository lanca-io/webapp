import type { Dispatch, MutableRefObject } from 'react'
import { formatUnits, parseUnits } from 'viem'
import { getInputError } from './handleInputError'
import { calculateLpAmount, calculateWithdrawableAmount } from './handleFetchLpInfo'
import { type PoolAction, PoolCardStage, type PoolState, PoolActionType, type PoolMode } from '../poolReducer/types'

export const setLpBalance = async (
	poolState: PoolState,
	swapDispatch: Dispatch<PoolAction>,
	typingTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | undefined>,
) => {
	const { poolMode, from, to } = poolState

	if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
	swapDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.input })

	const typingTimeoutId = setTimeout(async () => {
		const error = getInputError(poolState)
		swapDispatch({ type: PoolActionType.SET_INPUT_ERROR, payload: error })

		if (error) {
			swapDispatch({ type: PoolActionType.SET_LOADING, payload: false })
			return
		}

		const amountInDecimals = parseUnits(from.amount, from.token.decimals)
		swapDispatch({ type: PoolActionType.SET_LOADING, payload: true })

		const currentBalance = await calculateBalance(poolMode, amountInDecimals, to.token.decimals)

		swapDispatch({
			type: PoolActionType.SET_AMOUNT,
			direction: 'to',
			payload: {
				amount: String(currentBalance),
				amount_usd: Number(from.amount),
			},
		})

		swapDispatch({ type: PoolActionType.SET_LOADING, payload: false })
		swapDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.review })
	}, 700)

	typingTimeoutRef.current = typingTimeoutId
}

const calculateBalance = async (
	poolMode: PoolMode,
	amountInDecimals: bigint,
	tokenDecimals: number,
): Promise<number> => {
	if (poolMode === 'deposit') {
		const lpAmount = await calculateLpAmount(amountInDecimals)
		return Number(formatUnits(lpAmount, tokenDecimals))
	} else if (poolMode === 'withdraw') {
		const usdcAmount = await calculateWithdrawableAmount(amountInDecimals)
		return Number(formatUnits(usdcAmount, tokenDecimals))
	}
	return 0
}

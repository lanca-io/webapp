import { type Dispatch, type MutableRefObject, useEffect } from 'react'
import { handleFetchBalance } from './handlers/handleFetchBalance'
import { PoolActionType, type PoolAction, type PoolState } from './poolReducer/types'
import { handleSetLpBalance } from './handlers/handleSetLPBalance'
import { checkLastWithdrawRequest } from './handlers/handleLastWithdrawalRequest'
import { type Address } from 'viem'

interface UseSwapCardEffectsProps {
	poolState: PoolState
	poolDispatch: Dispatch<PoolAction>
	address: Address | undefined
	typingTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | undefined>
}

export function usePoolCardEffects({ poolState, poolDispatch, address, typingTimeoutRef }: UseSwapCardEffectsProps) {
	const { from, balance } = poolState

	useEffect(() => {
		void handleFetchBalance({ from, address, dispatch: poolDispatch })
	}, [from.token.address, from.chain.id, from.amount, address])

	useEffect(() => {
		void handleSetLpBalance(poolState, poolDispatch, typingTimeoutRef)
	}, [from.token.address, from.chain.id, from.amount, balance])

	useEffect(() => {
		if (poolState.poolMode !== 'withdraw') return
		if (!address) return

		checkLastWithdrawRequest(address)
	}, [address, poolState.poolMode])

	useEffect(() => {
		if (address) {
			poolDispatch({ type: PoolActionType.SET_ADDRESS, direction: 'from', payload: address })
			poolDispatch({ type: PoolActionType.SET_ADDRESS, direction: 'to', payload: address })
		}
	}, [address])
}

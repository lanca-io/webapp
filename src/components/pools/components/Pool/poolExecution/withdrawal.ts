import { type WalletClient } from 'viem'
import { PoolActionType, PoolCardStage, type PoolAction, type PoolState } from '../poolReducer/types'
import { type Dispatch } from 'react'

export async function handleWithdrawal(
	poolState: PoolState,
	poolDispatch: Dispatch<PoolAction>,
	walletClient: WalletClient,
) {
	const { to, from } = poolState

	if (to.amount === '' || to.amount === '0') return

	poolDispatch({ type: PoolActionType.SET_LOADING, payload: true })
	poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.progress })
	poolDispatch({
		type: PoolActionType.SET_SWAP_STEPS,
		payload: [
			{
				title: 'Action required',
				body: 'Please approve the transaction in your wallet',
				status: 'await',
				txLink: null,
			},
		],
	})
}
// export async function startWithdrawal(
// 	swapState: SwapState,
// 	swapDispatch: Dispatch<SwapAction>,
// 	walletClient: WalletClient,
// ): Promise<{ duration: number; hash: string } | undefined> {
// 	try {
// 		if (swapState.to.amount === '0' || swapState.to.amount === '') {
// 			return
// 		}

// 		swapDispatch({ type: 'SET_LOADING', payload: true })
// 		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })
// 		swapDispatch({
// 			type: 'APPEND_SWAP_STEP',
// 			payload: {
// 				title: 'Action required',
// 				body: 'Please approve the transaction in your wallet',
// 				status: 'await',
// 				txLink: null,
// 			},
// 		})

// 		await walletClient.switchChain({ id: chain.id })

// 		swapDispatch({
// 			type: 'SET_SWAP_STEPS',
// 			payload: [{ status: 'pending', title: 'Sending transaction' }],
// 		})

// 		await checkAllowanceAndApprove(swapState, swapDispatch, publicClient, walletClient)
// 		const hash = await sendTransaction(swapState, walletClient)

// 		await checkTransactionStatus(hash, publicClient, swapDispatch)
// 	} catch (error) {
// 		console.error(error)
// 		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
// 		swapDispatch({
// 			type: 'SET_SWAP_STEPS',
// 			payload: [{ title: 'Transaction failed', body: 'Something went wrong', status: 'error' }],
// 		})
// 		void trackEvent({
// 			category: category.PoolCard,
// 			action: trackingAction.FailedWithdrawalRequest,
// 			label: 'action_failed_withdraw_request',
// 			data: { from: swapState.from, to: swapState.to },
// 		})
// 	} finally {
// 		swapDispatch({ type: 'SET_LOADING', payload: false })
// 	}
// }

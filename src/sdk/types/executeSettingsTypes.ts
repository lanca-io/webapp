import { type WalletClient } from 'viem'

export type SwitchChainHook = (chainId: number) => Promise<WalletClient | undefined | void>

export enum ExecuteRouteStage {
	setChain = 'SET_CHAIN',
	setAddress = 'SET_ADDRESS',
	checkAllowance = 'CHECK_ALLOWANCE',
	awaitApprove = 'AWAIT_APPROVE',
	pendingApprove = 'PENDING_APPROVE',
	pendingTransaction = 'PENDING_TRANSACTION',
	confirmingTransaction = 'CONFIRMING_TRANSACTION',
	failedTransaction = 'FAILED_TRANSACTION',
	successTransaction = 'SUCCESS_TRANSACTION',
	internalError = 'INTERNAL_ERROR',
	longDurationConfirming = 'LONG_DURATION_CONFIRMING',
}

export type Status = 'idle' | 'pending' | 'await' | 'success' | 'error'

export interface ExecutionState {
	stage: ExecuteRouteStage
	payload?: {
		title: string
		body: string
		status: Status
		txLink: null
	}
}

export type UpdateRouteHook = (executionState: any) => void

export interface ExecutionConfigs {
	switchChainHook?: SwitchChainHook
	executionStateUpdateHook?: UpdateRouteHook
	executeInBackground?: boolean
	infiniteApproval?: boolean
}

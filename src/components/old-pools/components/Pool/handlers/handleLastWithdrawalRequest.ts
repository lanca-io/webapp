import { type Address } from 'viem'
import { get } from '../../../../../api/client'
import { config } from '../../../../../constants/config'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

export enum ParentPoolEventType {
	DepositInitiated,
	DepositCompleted,
	WithdrawalRequestInitiated,
	WithdrawalCompleted,
	CLFRequestError,
}

export async function fetchParentPoolActionsByLpAddress(lpAddress: string) {
	try {
		const url = config.baseURL + `/userParentPoolActions?lpAddress=${lpAddress}`
		const response = await get(url)

		if (!response.data.success) {
			return []
		}

		return response.data.data
	} catch (error) {
		console.error('Failed to fetch parent pool actions by lp address:', error)
		return []
	}
}

export const parentPoolEventNamesMap: Record<ParentPoolEventType, string> = {
	[ParentPoolEventType.DepositInitiated]: 'Deposit Initiated',
	[ParentPoolEventType.DepositCompleted]: 'Deposit Completed',
	[ParentPoolEventType.WithdrawalRequestInitiated]: 'Withdrawal Request Initiated',
	[ParentPoolEventType.WithdrawalCompleted]: 'Withdrawal Completed',
	[ParentPoolEventType.CLFRequestError]: 'CLF Request Error',
}

export const checkLastWithdrawRequest = async (lpAddress: Address) => {
	const actions = await fetchParentPoolActionsByLpAddress(lpAddress)

	for (const action of actions) {
		if (action.eventType === ParentPoolEventType.WithdrawalCompleted) {
			return null
		}

		if (action.eventType === ParentPoolEventType.WithdrawalRequestInitiated) {
			return action
		}
	}

	return null
}

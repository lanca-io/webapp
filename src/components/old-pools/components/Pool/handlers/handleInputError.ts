import { type PoolState } from '../poolReducer/types'
import { ErrorType } from '../../../config/errors/ErrorType'
import { config } from '../../../../../constants/config'
import BigNumber from 'bignumber.js'

const minAmount = config.IS_TESTNET ? 0 : 250

export function getInputError(swapState: PoolState): ErrorType | null {
	const { from, balance, poolMode } = swapState

	if (from.amount === '') return null

	const amount = new BigNumber(from.amount)

	if (poolMode === 'deposit') {
		if (amount.lt(minAmount)) {
			return ErrorType.AMOUNT_TOO_LOW
		}
	}

	if (balance && amount.gt(balance.amount.formatted)) {
		return ErrorType.LOW_BALANCE
	}

	return null
}

import type { FC } from 'react'
import { PoolsActionType } from '@/components/common/PoolActionModal/Reducer/types'
import { formatUnits } from 'viem'
import './Amount.pcss'

type ActionProps = {
	type: PoolsActionType
	amount?: string | null
	lpAmount?: string | null
}

export const Amount: FC<ActionProps> = ({ type, amount, lpAmount }) => {
	const isDeposit = type === PoolsActionType.Deposit
	const denomination = isDeposit ? 'USDC' : 'CLP'
	const rawValue = isDeposit ? amount : lpAmount

	if (!rawValue) {
		return (
			<div className="actions_table_amount">
				<span className="actions_table_amount_value">-</span>
			</div>
		)
	}

	const parsedAmount = Number(formatUnits(BigInt(rawValue), 6))
	const sign = isDeposit ? '+' : '-'

	return (
		<div className="actions_table_amount">
			<span className="actions_table_amount_value">
				{sign}
				{parsedAmount.toLocaleString()}
			</span>
			<span className="actions_table_amount_denomination">{denomination}</span>
		</div>
	)
}

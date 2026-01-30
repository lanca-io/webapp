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
	const isDeposit: boolean = type === PoolsActionType.Deposit
	const raw: string | null | undefined = isDeposit ? amount : lpAmount
	const denomination: string = isDeposit ? 'USDC' : 'CLP'

	const trimmed: string | null = typeof raw === 'string' ? raw.trim() : null
	const isValid = trimmed && trimmed !== '0'

	const displayValue = isValid
		? `${isDeposit ? '+' : '-'}${Number(formatUnits(BigInt(trimmed), 6)).toLocaleString()}`
		: '-'

	return (
		<div className="actions_table_amount">
			<span className="actions_table_amount_value">{displayValue}</span>
			<span className="actions_table_amount_denomination">{denomination}</span>
		</div>
	)
}

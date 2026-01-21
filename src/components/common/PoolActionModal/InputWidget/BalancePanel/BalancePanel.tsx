import { FC, useMemo } from 'react'
import { usePoolsUserBalancesStore } from '@/store/pools-user-balances/usePoolsUserBalancesStore'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import './BalancePanel.pcss'

enum Direction {
	From = 'FROM',
	To = 'TO',
}

type BalancePanelProps = {
	type: PoolsExecutionType
	direction: Direction
}

export const BalancePanel: FC<BalancePanelProps> = ({ type, direction }) => {
	const { usd, lp } = usePoolsUserBalancesStore()

	const { symbol, displayValue } = useMemo(() => {
		const isDepositFrom =
			type === PoolsExecutionType.DEPOSIT && direction === Direction.From
		const isClpFlow =
			!isDepositFrom &&
			((type === PoolsExecutionType.DEPOSIT && direction === Direction.To) ||
				(type !== PoolsExecutionType.DEPOSIT && direction === Direction.From))

		return isDepositFrom
			? { symbol: 'USDC' as const, displayValue: usd }
			: isClpFlow
				? { symbol: 'CLP' as const, displayValue: lp }
				: { symbol: 'USDC' as const, displayValue: usd }
	}, [type, direction, usd, lp])
	return (
		<div className="pool_action_balance_info_container">
			<span className="pool_action_balance_info_title">Balance</span>
			<span className="pool_action_balance_info_value">
				{displayValue ?? '0'}
			</span>
			<span className="pool_action_balance_info_symbol">{symbol}</span>
		</div>
	)
}

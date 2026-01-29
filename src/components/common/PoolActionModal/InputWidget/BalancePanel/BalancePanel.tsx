import { FC, useMemo } from 'react'
import { usePoolsUserBalancesStore } from '@/store/pools-positions/usePoolsPositionsStore'
import { PoolsActionType } from '../../Reducer/types'
import { usePoolsActionContext } from '../../Reducer/Provider'
import './BalancePanel.pcss'

enum Direction {
	From = 'FROM',
	To = 'TO',
}

type BalancePanelProps = {
	direction: Direction
}

export const BalancePanel: FC<BalancePanelProps> = ({ direction }) => {
	const { state } = usePoolsActionContext()
	const { usd, lp } = usePoolsUserBalancesStore()

	const { symbol, displayValue } = useMemo(() => {
		const isDepositFrom =
			state.type === PoolsActionType.Deposit && direction === Direction.From
		const isClpFlow =
			!isDepositFrom &&
			((state.type === PoolsActionType.Deposit && direction === Direction.To) ||
				(state.type !== PoolsActionType.Deposit &&
					direction === Direction.From))
		return isDepositFrom
			? { symbol: 'USDC' as const, displayValue: usd }
			: isClpFlow
				? { symbol: 'CLP' as const, displayValue: lp }
				: { symbol: 'USDC' as const, displayValue: usd }
	}, [state.type, direction, usd, lp])
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

import { FC, useMemo, useCallback } from 'react'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'
import { PoolsActionType } from '../../Reducer/types'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { useInputWidgetContext } from '../Reducer/Provider'
import { InputActionType } from '../Reducer/types'
import { sanitizeNumbers } from '@/utils/input'
import './BalancePanel.pcss'

enum Direction {
	From = 'FROM',
	To = 'TO',
}

type BalancePanelProps = {
	direction: Direction
}

export const BalancePanel: FC<BalancePanelProps> = ({ direction }) => {
	const { dispatch: inputDispatch } = useInputWidgetContext()
	const { state: poolsState } = usePoolsActionContext()
	const { usd, lp } = usePoolsPositions()

	const { symbol, displayValue, maxAmount } = useMemo(() => {
		const isDepositFrom =
			poolsState.type === PoolsActionType.Deposit &&
			direction === Direction.From
		const isClpFlow =
			!isDepositFrom &&
			((poolsState.type === PoolsActionType.Deposit &&
				direction === Direction.To) ||
				(poolsState.type !== PoolsActionType.Deposit &&
					direction === Direction.From))

		return isDepositFrom
			? { symbol: 'USDC' as const, displayValue: usd, maxAmount: usd }
			: isClpFlow
				? { symbol: 'CLP' as const, displayValue: lp, maxAmount: lp }
				: { symbol: 'USDC' as const, displayValue: usd, maxAmount: usd }
	}, [poolsState.type, direction, usd, lp])

	const hasBalance = (displayValue ?? 0) > 0
	const isFrom = direction === Direction.From
	const showMax = hasBalance && isFrom

	const handleMaxClick = useCallback(() => {
		if (maxAmount && maxAmount > 0) {
			const sanitized = sanitizeNumbers(maxAmount.toString())
			inputDispatch({ type: InputActionType.CHANGE, payload: sanitized })
		}
	}, [maxAmount, inputDispatch])

	return (
		<div className="pool_action_balance_info_container">
			<span className="pool_action_balance_info_title">Balance</span>
			<span className="pool_action_balance_info_value">
				{displayValue ?? '0'}
			</span>
			<span className="pool_action_balance_info_symbol">{symbol}</span>
			{showMax && (
				<button
					onClick={handleMaxClick}
					className="pool_action_max_button"
					type="button"
					aria-label="Set maximum amount"
				>
					Max
				</button>
			)}
		</div>
	)
}

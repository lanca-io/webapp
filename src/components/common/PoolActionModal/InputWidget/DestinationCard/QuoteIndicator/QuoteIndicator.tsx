import type { FC } from 'react'
import { useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useInputWidgetContext } from '../../Reducer/Provider'
import { usePoolsActionContext } from '../../../Reducer/Provider'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { PoolsActionType } from '../../../Reducer/types'
import { format } from '@/utils/format'
import './QuoteIndicator.pcss'

export const QuoteIndicator: FC = () => {
	const { state: poolsState } = usePoolsActionContext()
	const { state: inputState } = useInputWidgetContext()
	const { lpPrice } = usePoolsDataStore()

	const input = useDebounce(inputState.input, 300)

	const amount = useMemo(() => {
		if (
			inputState.warning ||
			inputState.error ||
			inputState.input !== input ||
			!lpPrice ||
			!input
		) {
			return '0'
		}

		const value = parseFloat(input)
		const fee = 0.00005

		let out
		switch (poolsState.type) {
			case PoolsActionType.Deposit:
				out = (value / lpPrice) * (1 - fee)
				break
			case PoolsActionType.Withdraw:
				out = value * lpPrice * (1 - fee)
				break
			default:
				out = 0
		}

		if (isNaN(out) || out === 0) {
			return '0'
		}

		return out.toFixed(9)
	}, [
		input,
		lpPrice,
		poolsState.type,
		inputState.error,
		inputState.warning,
		inputState.input,
	])

	const value = useMemo(() => {
		const num = parseFloat(amount)
		if (num <= 0) return '$0'

		return poolsState.type === PoolsActionType.Deposit
			? num.toFixed(4)
			: format(num, 4, '$')
	}, [amount, poolsState.type])

	const impact = useMemo(() => {
		const num = parseFloat(input || '0')
		return num > 0 ? { text: '-0.005%' } : null
	}, [input])

	return (
		<div className="pool_action_quote_indicator">
			<div className="pool_action_quote_indicator_info">
				<span className="pool_action_quote_indicator_equal">=</span>
				<span className="pool_action_quote_indicator_value">{value}</span>
				{impact && (
					<span className="pool_action_quote_indicator_impact">
						({impact.text})
					</span>
				)}
			</div>
		</div>
	)
}

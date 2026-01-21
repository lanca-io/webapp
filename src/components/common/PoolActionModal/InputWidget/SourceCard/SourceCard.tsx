import type { FC } from 'react'
import { useMemo } from 'react'
import { useInputWidgetContext } from '../Reducer/Provider'
import { InputActionType } from '../Reducer/types'
import { Header } from './Header/Header'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import { WidgetInput } from '@/components/common/WidgetInput/WidgetInput'
import { BalancePanel } from '../BalancePanel/BalancePanel'
import './SourceCard.pcss'

type SourceCardProps = {
	type: PoolsExecutionType
	onClose: () => void
}

export const SourceCard: FC<SourceCardProps> = ({ type, onClose }) => {
	const { state, dispatch } = useInputWidgetContext()

	const header = useMemo(
		() => (
			<Header
				title={type === PoolsExecutionType.DEPOSIT ? 'Deposit' : 'Withdrawal'}
				onClose={onClose}
			/>
		),
		[type, onClose],
	)

	const panel = useMemo(
		() => <AssetPanel type={type} direction={Direction.From} />,
		[type],
	)

	const input = useMemo(
		() => (
			<WidgetInput
				value={state.input}
				placeholder="0"
				onChange={e =>
					dispatch({ type: InputActionType.CHANGE, payload: e.target.value })
				}
				onFocus={() => dispatch({ type: InputActionType.FOCUS })}
				onBlur={() => dispatch({ type: InputActionType.BLUR })}
			/>
		),
		[state.input, dispatch],
	)

	const balance = useMemo(
		() => <BalancePanel type={type} direction={Direction.From} />,
		[type],
	)

	return (
		<div className="pool_action_source_card">
			{header}
			{panel}
			{input}
			{balance}
		</div>
	)
}

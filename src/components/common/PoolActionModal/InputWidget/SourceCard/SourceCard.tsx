import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { useInputWidgetContext } from '../Reducer/Provider'
import { InputActionType } from '../Reducer/types'
import { Header } from './Header/Header'
import { PoolsActionType } from '../../Reducer/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import { WidgetInput } from '@/components/common/WidgetInput/WidgetInput'
import { BalancePanel } from '../BalancePanel/BalancePanel'
import { useActionValidation } from '../useActionValidation'
import { ActionIndicator } from '../ActionIndicator/ActionIndicator'
import { usePoolsActionContext } from '../../Reducer/Provider'
import './SourceCard.pcss'

type SourceCardProps = {
	onClose: () => void
}

export const SourceCard: FC<SourceCardProps> = ({ onClose }) => {
	const { state: poolsState } = usePoolsActionContext()
	const { state, dispatch } = useInputWidgetContext()
	const { validate, clearValidations } = useActionValidation(poolsState.type)

	const header = useMemo(
		() => (
			<Header
				title={
					poolsState.type === PoolsActionType.Deposit ? 'Deposit' : 'Withdrawal'
				}
				onClose={onClose}
			/>
		),
		[poolsState.type, onClose],
	)

	const panel = useMemo(() => <AssetPanel direction={Direction.From} />, [])

	const input = useMemo(
		() => (
			<WidgetInput
				value={state.input}
				placeholder="0"
				maxLength={9}
				onChange={e => {
					dispatch({ type: InputActionType.CHANGE, payload: e.target.value })
					validate()
				}}
				onFocus={() => dispatch({ type: InputActionType.FOCUS })}
				onBlur={() => dispatch({ type: InputActionType.BLUR })}
				onKeyDown={e => e.key === ' ' && e.preventDefault()}
			/>
		),
		[state.input, dispatch, validate],
	)

	const balance = useMemo(
		() => <BalancePanel direction={Direction.From} />,
		[poolsState.type],
	)
	const indicator = useMemo(() => <ActionIndicator />, [poolsState.type])

	useEffect(() => {
		if (state.isTouched && state.rawInput > 0n) {
			validate()
		} else if (state.rawInput === 0n) {
			clearValidations()
		}
	}, [state.rawInput, state.isTouched])

	return (
		<div className="pool_action_source_card">
			{header}
			{panel}
			{input}
			{indicator}
			{balance}
		</div>
	)
}

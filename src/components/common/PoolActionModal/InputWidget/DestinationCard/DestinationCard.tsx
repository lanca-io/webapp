import type { FC } from 'react'
import { useMemo } from 'react'
import { useInputWidgetContext } from '../Reducer/Provider'
import { PoolsActionType } from '../../Reducer/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import { WidgetInput } from '@/components/common/WidgetInput/WidgetInput'
import { BalancePanel } from '../BalancePanel/BalancePanel'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { WarningWidget } from './WarningWidget/WarningWidget'
import { useDebounce } from '@/hooks/useDebounce'
import { usePoolsActionContext } from '../../Reducer/Provider'
import './DestinationCard.pcss'

export const DestinationCard: FC = () => {
	const { state: poolsState } = usePoolsActionContext()
	const { state } = useInputWidgetContext()
	const { lpPrice } = usePoolsDataStore()

	const debouncedInput = useDebounce(state.input, 300)

	const amount = useMemo(() => {
		if (
			state.warning ||
			state.error ||
			!lpPrice ||
			!debouncedInput ||
			state.input !== debouncedInput
		) {
			return '0'
		}

		const input = parseFloat(debouncedInput)
		const FEE_BPS = 0.00005

		let output
		switch (poolsState.type) {
			case PoolsActionType.DEPOSIT:
				output = (input / lpPrice) * (1 - FEE_BPS)
				break
			case PoolsActionType.WITHDRAWAL:
				output = input * lpPrice * (1 - FEE_BPS)
				break
			default:
				output = 0
		}

		return output.toFixed(6)
	}, [debouncedInput, lpPrice, poolsState.type, state.error, state.warning])

	const panel = useMemo(
		() => <AssetPanel direction={Direction.To} />,
		[poolsState.type],
	)
	const input = useMemo(
		() => <WidgetInput value={amount} placeholder="0" disabled />,
		[amount],
	)
	const balance = useMemo(
		() => <BalancePanel direction={Direction.To} />,
		[poolsState.type],
	)
	const warning = useMemo(
		() => (state.warning ? <WarningWidget /> : null),
		[state.warning],
	)

	return (
		<div className="pool_action_destination_card">
			{panel}
			{input}
			{balance}
			{warning}
		</div>
	)
}

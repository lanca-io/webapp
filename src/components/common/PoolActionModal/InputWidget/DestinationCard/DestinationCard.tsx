import type { FC } from 'react'
import { useMemo } from 'react'
import { useInputWidgetContext } from '../Reducer/Provider'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import { WidgetInput } from '@/components/common/WidgetInput/WidgetInput'
import { BalancePanel } from '../BalancePanel/BalancePanel'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { WarningWidget } from './WarningWidget/WarningWidget'
import { useDebounce } from '@/hooks/useDebounce'
import './DestinationCard.pcss'

type DestinationCardProps = {
	type: PoolsExecutionType
}

export const DestinationCard: FC<DestinationCardProps> = ({ type }) => {
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
		switch (type) {
			case PoolsExecutionType.DEPOSIT:
				output = (input / lpPrice) * (1 - FEE_BPS)
				break
			case PoolsExecutionType.WITHDRAWAL:
				output = input * lpPrice * (1 - FEE_BPS)
				break
			default:
				output = 0
		}

		return output.toFixed(6)
	}, [debouncedInput, lpPrice, type, state.error, state.warning])

	const panel = useMemo(
		() => <AssetPanel type={type} direction={Direction.To} />,
		[type],
	)
	const input = useMemo(
		() => <WidgetInput value={amount} placeholder="0" disabled />,
		[amount],
	)
	const balance = useMemo(
		() => <BalancePanel type={type} direction={Direction.To} />,
		[type],
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

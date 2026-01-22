import type { FC } from 'react'
import { useMemo } from 'react'
import { useInputWidgetContext } from '../Reducer/Provider'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import { WidgetInput } from '@/components/common/WidgetInput/WidgetInput'
import { BalancePanel } from '../BalancePanel/BalancePanel'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { WarningWidget } from './WarningWidget/WarningWidget'
import './DestinationCard.pcss'

type DestinationCardProps = {
	type: PoolsExecutionType
}

export const DestinationCard: FC<DestinationCardProps> = ({ type }) => {
	const { state } = useInputWidgetContext()
	const { lpPrice } = usePoolsDataStore()

	const destinationAmount = useMemo(() => {
		if (state.warning || state.error) return '0'
		if (!lpPrice || !state.input) return '0'

		const input = parseFloat(state.input)
		const FEE_BPS = 0.00005

		let output: number
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
	}, [state.input, lpPrice, type, state.error, state.warning])

	const panel = useMemo(
		() => <AssetPanel type={type} direction={Direction.To} />,
		[type],
	)

	const input = useMemo(
		() => (
			<WidgetInput value={String(destinationAmount)} placeholder="0" disabled />
		),
		[destinationAmount],
	)

	const balance = useMemo(
		() => <BalancePanel type={type} direction={Direction.To} />,
		[type],
	)

	const warning = useMemo(() => {
		if (state.warning) {
			return <WarningWidget />
		}
		return null
	}, [state.warning])

	return (
		<div className="pool_action_destination_card">
			{panel}
			{input}
			{balance}
			{warning}
		</div>
	)
}

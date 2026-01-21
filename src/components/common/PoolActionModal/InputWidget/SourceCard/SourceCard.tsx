import type { FC } from 'react'
import { useMemo } from 'react'
import { Header } from './Header/Header'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import { WidgetInput } from '@/components/common/WidgetInput/WidgetInput'
import { useInputHandler } from '@/hooks/useInputHandler'
import './SourceCard.pcss'

type SourceCardProps = {
	type: PoolsExecutionType
	onClose: () => void
}

export const SourceCard: FC<SourceCardProps> = ({ type, onClose }) => {
	const { value, onChange, onFocus, onBlur } = useInputHandler()
	const header = useMemo(
		() => (
			<Header
				title={type === PoolsExecutionType.DEPOSIT ? 'Deposit' : 'Withdrawal'}
				onClose={onClose}
			/>
		),
		[type],
	)

	const panel = useMemo(
		() => <AssetPanel type={type} direction={Direction.From} />,
		[type],
	)

	const input = useMemo(
		() => (
			<WidgetInput
				value={value}
				placeholder="0"
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		),
		[value, onChange, onFocus, onBlur],
	)

	return (
		<div className="pool_action_source_card">
			{header}
			{panel}
			{input}
		</div>
	)
}

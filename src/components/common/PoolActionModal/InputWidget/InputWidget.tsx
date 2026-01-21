import type { FC } from 'react'
import { useMemo } from 'react'
import { SourceCard } from './SourceCard/SourceCard'
import { DestinationCard } from './DestinationCard/DestinationCard'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import './InputWidget.pcss'
import { ActionCard } from './ActionCard/ActionCard'

type InputFormProps = {
	type: PoolsExecutionType
	onClose: () => void
}

export const InputWidget: FC<InputFormProps> = ({ type, onClose }) => {
	const source = useMemo(
		() => <SourceCard type={type} onClose={onClose} />,
		[type],
	)
	const destination = useMemo(() => <DestinationCard type={type} />, [type])
	const action = useMemo(() => <ActionCard type={type} />, [type])

	return (
		<div className="pool_action_input_widget">
			{source}
			{destination}
			{action}
		</div>
	)
}

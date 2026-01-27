import type { FC } from 'react'
import { useMemo } from 'react'
import { SourceCard } from './SourceCard/SourceCard'
import { DestinationCard } from './DestinationCard/DestinationCard'
import { PoolsActionType } from '../Reducer/types'
import { ActionCard } from './ActionCard/ActionCard'
import { Pointer } from './Pointer/Pointer'
import './InputWidget.pcss'

type InputFormProps = {
	type: PoolsActionType
	onClose: () => void
}

export const InputWidget: FC<InputFormProps> = ({ type, onClose }) => {
	const source = useMemo(() => <SourceCard onClose={onClose} />, [type])
	const destination = useMemo(() => <DestinationCard />, [type])
	const action = useMemo(() => <ActionCard type={type} />, [type])
	const pointer = useMemo(() => <Pointer />, [type])

	return (
		<div className="pool_action_input_widget">
			{source}
			{destination}
			{pointer}
			{action}
		</div>
	)
}

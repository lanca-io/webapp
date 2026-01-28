import type { FC } from 'react'
import { useMemo } from 'react'
import { SourceCard } from './SourceCard/SourceCard'
import { DestinationCard } from './DestinationCard/DestinationCard'
import { ActionCard } from './ActionCard/ActionCard'
import { Pointer } from './Pointer/Pointer'
import { usePoolsActionContext } from '../Reducer/Provider'
import './InputWidget.pcss'

type InputFormProps = {
	onClose: () => void
}

export const InputWidget: FC<InputFormProps> = ({ onClose }) => {
	const { state } = usePoolsActionContext()
	const source = useMemo(() => <SourceCard onClose={onClose} />, [state.type])
	const destination = useMemo(() => <DestinationCard />, [state.type])
	const action = useMemo(() => <ActionCard type={state.type} />, [state.type])
	const pointer = useMemo(() => <Pointer />, [state.type])

	return (
		<div className="pool_action_input_widget">
			{source}
			{destination}
			{pointer}
			{action}
		</div>
	)
}

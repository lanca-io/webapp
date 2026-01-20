import type { FC } from 'react'
import { useMemo } from 'react'
import { SourceCard } from './SourceCard/SourceCard'
import { PoolActionType } from '@/store/pool-action-execution/types'
import './InputWidget.pcss'

type InputFormProps = {
	type: PoolActionType
}

export const InputWidget: FC<InputFormProps> = ({ type }) => {
	const source = useMemo(() => <SourceCard type={type} />, [type])

	return <div className="pool_action_input_widget">{source}</div>
}

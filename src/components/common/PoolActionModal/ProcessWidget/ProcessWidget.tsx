import type { FC } from 'react'
import { memo, useEffect } from 'react'
import { ProcessHeading } from './ProcessHeading/ProcessHeading'
import { ProcessAction } from './ProcessAction/ProcessAction'
import { usePoolsActionContext } from '../Reducer/Provider'
import {
	PoolsActionStages,
	PoolsActionStatus,
	PoolsStateActions,
} from '../Reducer/types'
import { ProcessContent } from './ProcessContent/ProcessContent'
import { ProcessInfo } from './ProcessInfo/ProcessInfo'
import { ProcessStatus } from './ProcessStatus/ProcessStatus'
import './ProcessWidget.pcss'

export const ProcessWidget: FC = memo(() => {
	const { dispatch } = usePoolsActionContext()

	useEffect(() => {
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.QUEUE,
				status: PoolsActionStatus.PENDING,
			},
		})
	}, [])

	return (
		<div className="process_widget">
			<div className="process_widget_content">
				<ProcessHeading />
				<ProcessContent />
				<ProcessStatus />
				<ProcessInfo />
			</div>

			<ProcessAction />
		</div>
	)
})

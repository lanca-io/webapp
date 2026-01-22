import type { FC } from 'react'
import { memo } from 'react'
import { ProcessHeading } from './ProcessHeading/ProcessHeading'
import './ProcessWidget.pcss'

export const ProcessWidget: FC = memo(() => {
	return (
		<div className={`process_widget`}>
			<ProcessHeading />
		</div>
	)
})

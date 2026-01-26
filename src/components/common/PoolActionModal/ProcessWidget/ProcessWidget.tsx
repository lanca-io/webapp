import type { FC } from 'react'
import { memo } from 'react'
import { ProcessHeading } from './ProcessHeading/ProcessHeading'
import { ProcessAction } from './ProcessAction/ProcessAction'
import { ProcessContent } from './ProcessContent/ProcessContent'
import { ProcessInfo } from './ProcessInfo/ProcessInfo'
import { ProcessStatus } from './ProcessStatus/ProcessStatus'
import './ProcessWidget.pcss'

type ProcessWidgetProps = {
	onClose: () => void
}

export const ProcessWidget: FC<ProcessWidgetProps> = memo(({ onClose }) => {
	return (
		<div className="process_widget">
			<div className="process_widget_content">
				<ProcessHeading onClose={onClose} />
				<ProcessContent />
				<ProcessStatus />
				<ProcessInfo />
			</div>
			<ProcessAction />
		</div>
	)
})

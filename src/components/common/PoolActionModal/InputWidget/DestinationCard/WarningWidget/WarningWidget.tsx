import type { FC } from 'react'
import { InfoIcon } from '@/assets/InfoIcon'
import './WarningWidget.pcss'

export const WarningWidget: FC = () => {
	return (
		<div className="pool_action_warning_widget">
			<div className="pool_action_warning_widget_icon">
				<InfoIcon color="var(--color-warning-600)" />
			</div>
			<div className="pool_action_warning_widget_info">
				<span className="pool_action_warning_widget_title">
					Pool is almost full
				</span>
				<span className="pool_action_warning_widget_subtitle">
					The pool is nearly full, so deposits are currently limited.
				</span>
			</div>
		</div>
	)
}

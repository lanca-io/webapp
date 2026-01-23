import type { FC } from 'react'
import { createPortal } from 'react-dom'
import { PoolsActionType } from './Reducer/types'
import { PoolsActionProvider } from './Reducer/Provider'
import { ProcessWidget } from './ProcessWidget/ProcessWidget'
import { InputWidgetProvider } from './InputWidget/Reducer/Provider'
import './PoolActionModal.pcss'

type PoolActionModalProps = {
	type: PoolsActionType
	onClose: () => void
}

export const PoolActionModal: FC<PoolActionModalProps> = ({
	type,
	// onClose,
}) => {
	const modal = (
		<PoolsActionProvider initialType={type}>
			<InputWidgetProvider>
				<div className="pool_action_modal_overlay">
					<ProcessWidget />
				</div>
			</InputWidgetProvider>
		</PoolsActionProvider>
	)

	return createPortal(modal, document.body)
}

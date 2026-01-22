import type { FC } from 'react'
import { createPortal } from 'react-dom'
import { PoolsActionType } from './Reducer/types'
import { PoolsActionProvider } from './Reducer/Provider'
import './PoolActionModal.pcss'
import { ProcessWidget } from './ProcessWidget/ProcessWidget'

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
			<div className="pool_action_modal_overlay">
				<ProcessWidget />
			</div>
		</PoolsActionProvider>
	)

	return createPortal(modal, document.body)
}

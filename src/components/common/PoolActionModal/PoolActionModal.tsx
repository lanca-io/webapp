import type { FC } from 'react'
import { createPortal } from 'react-dom'
import { InputWidget } from './InputWidget/InputWidget'
import { PoolsActionType } from './Reducer/types'
import { PoolsActionProvider } from './Reducer/Provider'
import './PoolActionModal.pcss'

type PoolActionModalProps = {
	type: PoolsActionType
	onClose: () => void
}

export const PoolActionModal: FC<PoolActionModalProps> = ({
	type,
	onClose,
}) => {
	const modal = (
		<PoolsActionProvider initialType={type}>
			<div className="pool_action_modal_overlay">
				<InputWidget type={type} onClose={onClose} />
			</div>
		</PoolsActionProvider>
	)

	return createPortal(modal, document.body)
}

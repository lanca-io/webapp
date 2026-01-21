import type { FC } from 'react'
import { createPortal } from 'react-dom'
import { PoolActionType } from '@/store/pool-action-execution/types'
import { InputWidget } from './InputWidget/InputWidget'
import './PoolActionModal.pcss'

type PoolActionModalProps = {
	type: PoolActionType
	onClose: () => void
}

export const PoolActionModal: FC<PoolActionModalProps> = ({
	type,
	onClose,
}) => {
	const modal = (
		<div className="pool_action_modal_overlay">
			<InputWidget type={type} onClose={onClose} />
		</div>
	)

	return createPortal(modal, document.body)
}
